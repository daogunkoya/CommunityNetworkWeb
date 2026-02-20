import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MapPin, Check, X } from 'lucide-react';
import { addressService, type AddressSuggestion, type AddressComponents } from '@/services/address';

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  onAddressSelect?: (address: AddressComponents) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  showPostcodeSearch?: boolean;
}

export default function AddressInput({
  value,
  onChange,
  onAddressSelect,
  placeholder = "Enter your address",
  label = "Address",
  error,
  disabled = false,
  className = "",
  showPostcodeSearch = true
}: AddressInputProps) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressComponents | null>(null);
  const [postcodeMode, setPostcodeMode] = useState(false);
  const [manualEntry, setManualEntry] = useState(false);
  const [manualFields, setManualFields] = useState<AddressComponents | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  // Debug logging
  useEffect(() => {
    console.log('AddressInput - Value changed:', value);
    console.log('AddressInput - Suggestions:', suggestions);
    console.log('AddressInput - Show suggestions:', showSuggestions);
  }, [value, suggestions, showSuggestions]);

  // Debounced search for address suggestions (single input, optional postcode mode)
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (value.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        setIsLoading(true);
        console.log('AddressInput - Searching for:', value, 'Mode:', postcodeMode ? 'postcode' : 'address');
        const results = await addressService.getAutocompleteSuggestions(value, postcodeMode ? 'postcode' : 'address');
        console.log('AddressInput - API Results:', results);
        setSuggestions(results);
        setShowSuggestions(true);
        console.log('AddressInput - Set suggestions, count:', results.length);
      } catch (error) {
        console.error('Address search error:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value]);

  // Accept current manual fields as the chosen address
  const handleUseManualAddress = () => {
    if (!manualFields) return;
    setSelectedAddress(manualFields);
    onChange(manualFields.formatted_address || manualFields.address || '');
    onAddressSelect?.(manualFields);
  };

  // Select address from suggestions
  const handleAddressSelect = async (suggestion: AddressSuggestion) => {
    try {
      setIsLoading(true);
      const placeDetails = await addressService.getPlaceDetails(suggestion.place_id);
      
      if (placeDetails) {
        setSelectedAddress(placeDetails);
        setManualFields(placeDetails);
        onChange(placeDetails.formatted_address);
        onAddressSelect?.(placeDetails);
        setManualEntry(true);
        setShowSuggestions(false);
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Address selection error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear selected address
  const handleClearAddress = () => {
    setSelectedAddress(null);
    setManualFields(null);
    setManualEntry(false);
    onChange('');
    setShowSuggestions(false);
    setSuggestions([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setSelectedAddress(null);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor="address" className="flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        {label}
      </Label>

      {/* Single-field UX with optional postcode mode */}

      {/* Address Input */}
      <div className="relative">
        <Input
          ref={inputRef}
          id="address"
          value={value}
          onChange={handleInputChange}
          placeholder={postcodeMode ? 'Enter postcode (e.g., SW1A 1AA)' : placeholder}
          disabled={disabled}
          className={`pl-10 ${error ? 'border-red-500' : ''}`}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => {
            // Delay hiding suggestions to allow clicking on them
            setTimeout(() => setShowSuggestions(false), 200);
          }}
        />
        
        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        {showPostcodeSearch && (
          <Button
            type="button"
            variant={postcodeMode ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPostcodeMode(!postcodeMode)}
            className="absolute right-2 top-2 h-7 px-2"
            disabled={disabled}
          >
            {postcodeMode ? 'Postcode' : 'Address'}
          </Button>
        )}
        
        {selectedAddress && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClearAddress}
            className="absolute right-2 top-2 h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        {isLoading && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {/* Address Suggestions Dropdown */}
        {showSuggestions && (
          <div className="absolute z-[9999] w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto top-full mt-1 left-0">
            <div className="px-2 py-1 text-xs text-gray-500 bg-gray-50 border-b">
              Found {suggestions.length} addresses
            </div>
            {suggestions.length > 0 ? (
              suggestions.map((suggestion) => (
                <button
                  key={suggestion.place_id}
                  type="button"
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0"
                  onClick={() => handleAddressSelect(suggestion)}
                >
                  <div className="font-medium">{suggestion.name}</div>
                  <div className="text-sm text-gray-600">{suggestion.formatted_address}</div>
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500 text-sm">
                No addresses found. Try a different search or enter manually.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Manual entry toggle */}
      {!manualEntry && (
        <button
          type="button"
          className="text-xs text-blue-600 hover:underline"
          onClick={() => {
            setManualEntry(true);
            setManualFields(selectedAddress || {
              formatted_address: '',
              address: '',
              city: '',
              state: '',
              postal_code: '',
              country: 'UK',
              latitude: 0,
              longitude: 0,
              community_name: '',
              borough: '',
            });
          }}
        >
          Enter address manually
        </button>
      )}

      {/* Structured editable fields after selection or for manual entry */}
      {manualEntry && (
        <div className="space-y-3 p-3 border rounded-md">
          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-1">
              <Label>House/Flat and Street</Label>
              <Input
                value={manualFields?.address || ''}
                onChange={(e) => setManualFields(prev => prev ? { ...prev, address: e.target.value, formatted_address: e.target.value } : prev)}
                placeholder="e.g., 10 Downing St"
                disabled={disabled}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>City</Label>
                <Input
                  value={manualFields?.city || ''}
                  onChange={(e) => setManualFields(prev => prev ? { ...prev, city: e.target.value } : prev)}
                  disabled={disabled}
                />
              </div>
              <div className="space-y-1">
                <Label>County/State</Label>
                <Input
                  value={manualFields?.state || ''}
                  onChange={(e) => setManualFields(prev => prev ? { ...prev, state: e.target.value } : prev)}
                  disabled={disabled}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Postcode</Label>
                <Input
                  value={manualFields?.postal_code || ''}
                  onChange={(e) => setManualFields(prev => prev ? { ...prev, postal_code: e.target.value } : prev)}
                  placeholder="SW1A 1AA"
                  disabled={disabled}
                />
              </div>
              <div className="space-y-1">
                <Label>Country</Label>
                <Input
                  value={manualFields?.country || ''}
                  onChange={(e) => setManualFields(prev => prev ? { ...prev, country: e.target.value } : prev)}
                  disabled={disabled}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={handleUseManualAddress} disabled={disabled}>
              Use this address
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setManualEntry(false)} disabled={disabled}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
} 