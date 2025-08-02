import { useState, useEffect, useMemo } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Button,
  Menu,
  MenuItem,
  Link,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  AdminPanelSettings as AdminIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { createAppTheme } from './theme';
import { useTheme } from './hooks/useTheme';
import { Dashboard } from './components/Dashboard';
import { NodeDetail } from './components/NodeDetail';
import { Settings } from './components/Settings';
import { api } from './services/api';
import './i18n';

type Page = 'dashboard' | 'settings' | 'node-detail';

export default function App() {
  const { t } = useTranslation();
  const { actualTheme, colorTheme } = useTheme();

  // 使用 useMemo 确保主题在依赖项变化时重新创建
  const theme = useMemo(() => createAppTheme(actualTheme, colorTheme), [actualTheme, colorTheme]);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [siteSettings, setSiteSettings] = useState<{ sitename: string; description: string } | null>(null);

  // 获取站点设置
  useEffect(() => {
    const fetchSiteSettings = async () => {
      const settings = await api.getPublicSettings();
      if (settings) {
        setSiteSettings({
          sitename: settings.sitename,
          description: settings.description,
        });
      }
    };
    fetchSiteSettings();
  }, []);

  const handleViewDetails = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setCurrentPage('node-detail');
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
    setSelectedNodeId('');
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleAdminPanel = () => {
    window.open('/admin', '_blank');
    handleMenuClose();
  };

  const menuItems = [
    { key: 'dashboard', label: t('dashboard'), icon: <DashboardIcon /> },
    { key: 'settings', label: t('settings'), icon: <SettingsIcon /> },
  ];

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onViewDetails={handleViewDetails} />;
      case 'settings':
        return <Settings />;
      case 'node-detail':
        return <NodeDetail nodeId={selectedNodeId} onBack={handleBackToDashboard} />;
      default:
        return <Dashboard onViewDetails={handleViewDetails} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="fixed">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {siteSettings?.sitename || 'Komari Monitor'}
            </Typography>

            {/* 桌面端导航 */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.key}
                    color="inherit"
                    startIcon={item.icon}
                    onClick={() => setCurrentPage(item.key as Page)}
                    sx={{
                      backgroundColor: currentPage === item.key ? 'rgba(255,255,255,0.1)' : 'transparent',
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
                <Button
                  color="inherit"
                  startIcon={<AdminIcon />}
                  onClick={handleAdminPanel}
                >
                  {t('admin_panel')}
                </Button>
              </Box>
            )}

            {/* 移动端菜单按钮 */}
            {isMobile && (
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
              >
                <MoreIcon />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>

        {/* 移动端菜单 */}
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          {menuItems.map((item) => (
            <MenuItem
              key={item.key}
              onClick={() => {
                setCurrentPage(item.key as Page);
                handleMenuClose();
              }}
              selected={currentPage === item.key}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </MenuItem>
          ))}
          <MenuItem onClick={handleAdminPanel}>
            <ListItemIcon><AdminIcon /></ListItemIcon>
            <ListItemText primary={t('admin_panel')} />
          </MenuItem>
        </Menu>

        {/* 移动端右侧抽屉 */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: 280,
              boxSizing: 'border-box',
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto', p: 2 }}>
            <List>
              {menuItems.map((item) => (
                <ListItem key={item.key} disablePadding>
                  <ListItemButton
                    selected={currentPage === item.key}
                    onClick={() => {
                      setCurrentPage(item.key as Page);
                      setDrawerOpen(false);
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ))}
              <ListItem disablePadding>
                <ListItemButton onClick={handleAdminPanel}>
                  <ListItemIcon><AdminIcon /></ListItemIcon>
                  <ListItemText primary={t('admin_panel')} />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>

        {/* 主内容区域 */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: 8, // AppBar height
          }}
        >
          {renderContent()}
        </Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 2,
            px: 3,
            textAlign: 'center',
            borderTop: 1,
            borderColor: 'divider',
            mt: 'auto',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Powered by{' '}
            <Link
              href="https://github.com/komari-monitor/komari"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              underline="hover"
            >
              Komari Monitor
            </Link>
            {' • '}
            <Link
              href="https://github.com/uvexz/komari-theme-material"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              underline="hover"
            >
              Theme Material
            </Link>
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
