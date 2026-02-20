import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { api } from '@/services/api';

interface Reporter {
    id: number;
    name: string;
    email: string;
}

interface Reportable {
    id: number;
    body?: string;
    excerpt?: string;
    title?: string;
    content?: string;
    name?: string;
    text?: string;
}

interface Report {
    id: number;
    reporter_id: number;
    reportable_id: number;
    reportable_type: string;
    reason: string;
    notes: string | null;
    status: 'pending' | 'resolved' | 'dismissed';
    created_at: string;
    reporter: Reporter;
    reportable: Reportable | null;
}

interface ReportsResponse {
    success: boolean;
    data: {
        data: Report[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

const mapPolymorphicSnippet = (type: string, reportable: Reportable | null) => {
    if (!reportable) return <span className="text-gray-400 italic">Content deleted</span>;

    const snippet =
        reportable.body ||
        reportable.excerpt ||
        reportable.title ||
        reportable.content ||
        reportable.text ||
        reportable.name ||
        'View content payload';

    // Normalize huge snippets
    return snippet.length > 50 ? `${snippet.substring(0, 50)}...` : snippet;
};

export default function AdminReports() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const res = await api.get<ReportsResponse>('/reports');
            if (res.data.success) {
                setReports(res.data.data.data);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to fetch reports');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleResolve = async (id: number, action: 'dismiss' | 'delete_content') => {
        try {
            const res = await api.post(`/reports/${id}/resolve`, { action });
            if (res.data.success) {
                toast.success(`Report successfully ${action === 'dismiss' ? 'dismissed' : 'resolved & content deleted'}`);
                fetchReports();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to resolve report');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
            case 'resolved': return <Badge variant="default" className="bg-green-100 text-green-800">Resolved</Badge>;
            case 'dismissed': return <Badge variant="outline" className="text-gray-500">Dismissed</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Content Moderation</h1>
                    <p className="text-gray-500 mt-1">Review flagged posts, comments, and discussions across the community.</p>
                </div>
                <Button onClick={fetchReports} variant="outline" size="sm">
                    Refresh List
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Reports</CardTitle>
                    <CardDescription>
                        {reports.length} reports awaiting review.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Reporter</TableHead>
                                    <TableHead className="w-[30%]">Reported Content Snippet</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center">
                                            Loading reports...
                                        </TableCell>
                                    </TableRow>
                                ) : !Array.isArray(reports) || reports.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                                            No reports found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    reports.map((report) => (
                                        <TableRow key={report.id}>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize">
                                                    {report.reportable_type?.split('\\').pop() || 'Unknown'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{report.reporter?.name || 'Unknown'}</div>
                                                <div className="text-xs text-gray-500">{report.reporter?.email}</div>
                                            </TableCell>
                                            <TableCell className="max-w-xs truncate">
                                                {mapPolymorphicSnippet(report.reportable_type, report.reportable)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium text-red-600">{report.reason}</div>
                                                {report.notes && (
                                                    <div className="text-xs text-gray-500 truncate max-w-[150px]" title={report.notes}>
                                                        {report.notes}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-gray-500 whitespace-nowrap">
                                                {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(report.status)}
                                            </TableCell>
                                            <TableCell className="text-right whitespace-nowrap">
                                                {report.status === 'pending' && (
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => {
                                                                if (confirm('Are you certain you want to delete this reported content from the database? This cannot be undone.')) {
                                                                    handleResolve(report.id, 'delete_content');
                                                                }
                                                            }}
                                                        >
                                                            Delete Content
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleResolve(report.id, 'dismiss')}
                                                        >
                                                            Dismiss
                                                        </Button>
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
