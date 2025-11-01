import { useState, useMemo, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeProvider, createTheme, CssBaseline, Container, Box, Grid, Typography, CircularProgress, Chip } from '@mui/material';
import { Header } from './components/Header';
import { NodeCard } from './components/NodeCard';
import { SimpleNodeCard } from './components/SimpleNodeCard';
import { NodeTable } from './components/NodeTable';
import { NodeDetailsDialog } from './components/NodeDetailsDialog';
import { useNodes } from './hooks/useNodes';
import { useWebSocket } from './hooks/useWebSocket';
import { usePublicInfo } from './hooks/usePublicInfo';
import type { ViewMode, NodeInfo } from './types';

function App() {
  const { t } = useTranslation();
  const { nodes, loading: nodesLoading } = useNodes();
  const { publicInfo, loading: publicLoading } = usePublicInfo();
  const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/clients`;
  const { data: statusMap, online: onlineNodes } = useWebSocket(wsUrl);

  const [viewMode, setViewMode] = useState<ViewMode>('detailed-grid');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedNode, setSelectedNode] = useState<NodeInfo | null>(null);
  const [groupFilter, setGroupFilter] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  // 从 localStorage 加载设置
  useEffect(() => {
    const savedViewMode = localStorage.getItem('nodeViewMode') as ViewMode;
    const savedAppearance = localStorage.getItem('appearance');

    if (savedViewMode) {
      setViewMode(savedViewMode);
    } else if (publicInfo?.theme_settings?.defaultViewMode) {
      const modeMap: Record<string, ViewMode> = {
        '详细网格': 'detailed-grid',
        '简约网格': 'simple-grid',
        '表格': 'table'
      };
      setViewMode(modeMap[publicInfo.theme_settings.defaultViewMode] || 'detailed-grid');
    }

    if (savedAppearance === 'dark') {
      setDarkMode(true);
    } else if (savedAppearance === 'system') {
      setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, [publicInfo]);

  // 保存设置到 localStorage
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('nodeViewMode', mode);
  };

  const handleDarkModeToggle = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('appearance', newMode ? 'dark' : 'light');
  };

  // 根据主题设置创建主题
  const theme = useMemo(() => {
    const primaryColorMap: Record<string, string> = {
      '蓝色': '#1976d2',
      '紫色': '#9c27b0',
      '绿色': '#2e7d32',
      '橙色': '#ed6c02',
      '红色': '#d32f2f'
    };

    const primaryColor = publicInfo?.theme_settings?.primaryColor
      ? primaryColorMap[publicInfo.theme_settings.primaryColor] || '#1976d2'
      : '#1976d2';

    return createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
        primary: {
          main: primaryColor,
        },
      },
      transitions: {
        duration: {
          shortest: publicInfo?.theme_settings?.enableAnimations === false ? 0 : 150,
          shorter: publicInfo?.theme_settings?.enableAnimations === false ? 0 : 200,
          short: publicInfo?.theme_settings?.enableAnimations === false ? 0 : 250,
          standard: publicInfo?.theme_settings?.enableAnimations === false ? 0 : 300,
        },
      },
    });
  }, [darkMode, publicInfo?.theme_settings]);

  // 按 weight 排序并过滤节点
  const sortedNodes = useMemo(() => {
    let filtered = [...nodes];

    // 应用分组过滤
    if (groupFilter) {
      filtered = filtered.filter(node => node.group === groupFilter);
    }

    // 应用标签过滤
    if (tagFilter) {
      filtered = filtered.filter(node => {
        const tags = node.tags ? node.tags.split(';').map(tag => tag.trim()) : [];
        return tags.includes(tagFilter);
      });
    }

    return filtered.sort((a, b) => a.weight - b.weight);
  }, [nodes, groupFilter, tagFilter]);

  const cardsPerRow = publicInfo?.theme_settings?.cardsPerRow || 3;
  const gridSize = 12 / cardsPerRow;

  // 处理节点点击
  const handleNodeClick = useCallback((node: NodeInfo) => {
    setSelectedNode(node);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // 处理分组过滤
  const handleGroupFilter = useCallback((group: string) => {
    setGroupFilter(prev => prev === group ? null : group);
    setTagFilter(null); // 清除标签过滤
  }, []);

  // 处理标签过滤
  const handleTagFilter = useCallback((tag: string) => {
    setTagFilter(prev => prev === tag ? null : tag);
    setGroupFilter(null); // 清除分组过滤
  }, []);

  if (nodesLoading || publicLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Header
          sitename={publicInfo?.sitename || 'Komari Monitor'}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          darkMode={darkMode}
          onDarkModeToggle={handleDarkModeToggle}
        />

        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* 过滤提示 */}
          {(groupFilter || tagFilter) && (
            <Box mb={2} display="flex" alignItems="center" gap={1}>
              <Typography variant="body2" color="text.secondary">
                {t('filter.currentFilter')}
              </Typography>
              {groupFilter && (
                <Chip
                  label={t('filter.group', { group: groupFilter })}
                  onDelete={() => setGroupFilter(null)}
                  color="primary"
                  size="small"
                />
              )}
              {tagFilter && (
                <Chip
                  label={t('filter.tag', { tag: tagFilter })}
                  onDelete={() => setTagFilter(null)}
                  color="secondary"
                  size="small"
                />
              )}
            </Box>
          )}

          {sortedNodes.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Typography variant="h6" color="text.secondary">
                {groupFilter || tagFilter ? t('message.noMatchingNodes') : t('message.noNodes')}
              </Typography>
            </Box>
          ) : viewMode === 'table' ? (
            <NodeTable
              nodes={sortedNodes}
              statusMap={statusMap}
              onlineNodes={onlineNodes}
              onNodeClick={handleNodeClick}
            />
          ) : (
            <Grid container spacing={3}>
              {sortedNodes.map((node) => (
                <Grid size={{ xs: 12, sm: 6, md: gridSize }} key={node.uuid}>
                  {viewMode === 'detailed-grid' ? (
                    <NodeCard
                      node={node}
                      status={statusMap[node.uuid]}
                      online={onlineNodes.includes(node.uuid)}
                      onClick={() => handleNodeClick(node)}
                      onGroupFilter={handleGroupFilter}
                      onTagFilter={handleTagFilter}
                    />
                  ) : (
                    <SimpleNodeCard
                      node={node}
                      status={statusMap[node.uuid]}
                      online={onlineNodes.includes(node.uuid)}
                      onClick={() => handleNodeClick(node)}
                      onGroupFilter={handleGroupFilter}
                      onTagFilter={handleTagFilter}
                    />
                  )}
                </Grid>
              ))}
            </Grid>
          )}
        </Container>

        <Box component="footer" sx={{ py: 3, textAlign: 'center', borderTop: 1, borderColor: 'divider', mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            {t('footer.poweredBy')}{' '}
            <Typography
              component="a"
              href="https://github.com/komari-monitor/komari"
              target="_blank"
              rel="noopener noreferrer"
              variant="body2"
              sx={{
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              Komari Monitor
            </Typography>
            .{' '}
            {t('footer.theme')}{' '}
            <Typography
              component="a"
              href="https://github.com/uvexz/komari-theme-material"
              target="_blank"
              rel="noopener noreferrer"
              variant="body2"
              sx={{
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              Material
            </Typography>
            .
          </Typography>
        </Box>
      </Box>

      {/* 节点详情弹窗 */}
      <NodeDetailsDialog
        open={!!selectedNode}
        node={selectedNode}
        status={selectedNode ? statusMap[selectedNode.uuid] : undefined}
        online={selectedNode ? onlineNodes.includes(selectedNode.uuid) : false}
        onClose={handleCloseDetails}
      />
    </ThemeProvider>
  );
}

export default App;
