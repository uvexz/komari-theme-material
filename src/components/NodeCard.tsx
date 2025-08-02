import React from 'react';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Box,
    Chip,
    LinearProgress,
    Button,
    Grid,
    Divider,
} from '@mui/material';
import {
    Computer as ComputerIcon,
    Memory as MemoryIcon,
    Storage as StorageIcon,
    NetworkCheck as NetworkIcon,
    Schedule as UptimeIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Node, NodeStatus } from '../types';
import { formatPercentage, formatUptime, formatSpeed, formatRegion } from '../utils/format';

interface NodeCardProps {
    node: Node;
    status?: NodeStatus;
    isOnline: boolean;
    onViewDetails: (nodeId: string) => void;
}

export const NodeCard: React.FC<NodeCardProps> = ({
    node,
    status,
    isOnline,
    onViewDetails,
}) => {
    const { t } = useTranslation();

    const cpuUsage = status?.cpu.usage || 0;
    const memoryUsage = status ? (status.ram.used / status.ram.total) * 100 : 0;
    const diskUsage = status ? (status.disk.used / status.disk.total) * 100 : 0;

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" component="h2" noWrap>
                        {node.name}
                    </Typography>
                    <Chip
                        label={isOnline ? t('online') : t('offline')}
                        color={isOnline ? 'success' : 'error'}
                        size="small"
                    />
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {formatRegion(node.region)} • {node.os}
                </Typography>

                {status && (
                    <>
                        <Box mb={2}>
                            <Box display="flex" alignItems="center" mb={1}>
                                <ComputerIcon fontSize="small" sx={{ mr: 1 }} />
                                <Typography variant="body2">
                                    {t('cpu')}: {formatPercentage(cpuUsage)}
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={cpuUsage}
                                color={cpuUsage > 80 ? 'error' : cpuUsage > 60 ? 'warning' : 'primary'}
                            />
                        </Box>

                        <Box mb={2}>
                            <Box display="flex" alignItems="center" mb={1}>
                                <MemoryIcon fontSize="small" sx={{ mr: 1 }} />
                                <Typography variant="body2">
                                    {t('memory')}: {formatPercentage(memoryUsage)}
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={memoryUsage}
                                color={memoryUsage > 80 ? 'error' : memoryUsage > 60 ? 'warning' : 'primary'}
                            />
                        </Box>

                        <Box mb={2}>
                            <Box display="flex" alignItems="center" mb={1}>
                                <StorageIcon fontSize="small" sx={{ mr: 1 }} />
                                <Typography variant="body2">
                                    {t('disk')}: {formatPercentage(diskUsage)}
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={diskUsage}
                                color={diskUsage > 80 ? 'error' : diskUsage > 60 ? 'warning' : 'primary'}
                            />
                        </Box>

                        <Divider sx={{ my: 1 }} />

                        <Grid container spacing={1}>
                            <Grid size={6}>
                                <Box display="flex" alignItems="center">
                                    <NetworkIcon fontSize="small" sx={{ mr: 0.5 }} />
                                    <Typography variant="caption">
                                        ↑{formatSpeed(status.network.up)}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={6}>
                                <Box display="flex" alignItems="center">
                                    <NetworkIcon fontSize="small" sx={{ mr: 0.5 }} />
                                    <Typography variant="caption">
                                        ↓{formatSpeed(status.network.down)}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={12}>
                                <Box display="flex" alignItems="center">
                                    <UptimeIcon fontSize="small" sx={{ mr: 0.5 }} />
                                    <Typography variant="caption">
                                        {formatUptime(status.uptime, t)}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </>
                )}
            </CardContent>

            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button
                    size="small"
                    onClick={() => onViewDetails(node.uuid)}
                    disabled={!isOnline}
                >
                    {t('view_details')}
                </Button>
            </CardActions>
        </Card>
    );
};