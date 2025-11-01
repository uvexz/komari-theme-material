import { AppBar, Toolbar, Typography, Box, ToggleButtonGroup, ToggleButton, IconButton, Button, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ViewMode } from '../types';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import TableRowsIcon from '@mui/icons-material/TableRows';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LanguageIcon from '@mui/icons-material/Language';

interface HeaderProps {
  sitename: string;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  darkMode: boolean;
  onDarkModeToggle: () => void;
}

export function Header({ sitename, viewMode, onViewModeChange, darkMode, onDarkModeToggle }: HeaderProps) {
  const { t, i18n } = useTranslation();
  const [langAnchor, setLangAnchor] = useState<null | HTMLElement>(null);

  const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
    setLangAnchor(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLangAnchor(null);
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
    handleLanguageClose();
  };

  const languages = [
    { code: 'zh', name: '中文' },
    { code: 'en', name: 'English' },
    { code: 'ja', name: '日本語' }
  ];

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, px: { xs: 1, sm: 2 } }}>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontSize: { xs: '1rem', sm: '1.25rem' },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {sitename}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 2 } }}>
          {/* 管理员按钮 - 在小屏幕上只显示图标 */}
          <Button
            color="inherit"
            startIcon={<AdminPanelSettingsIcon />}
            href="/admin"
            sx={{ 
              textTransform: 'none',
              minWidth: { xs: 'auto', sm: 'auto' },
              px: { xs: 1, sm: 2 },
              '& .MuiButton-startIcon': {
                margin: { xs: 0, sm: '0 8px 0 -4px' }
              }
            }}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              {t('header.admin')}
            </Box>
          </Button>

          {/* 视图切换按钮组 */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, newMode) => newMode && onViewModeChange(newMode)}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                px: { xs: 0.5, sm: 1 },
                minWidth: { xs: 32, sm: 40 },
                '&.Mui-selected': {
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  }
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }
            }}
          >
            <ToggleButton value="detailed-grid" aria-label={t('header.detailedGrid')}>
              <ViewModuleIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="simple-grid" aria-label={t('header.simpleGrid')}>
              <GridViewIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="table" aria-label={t('header.table')}>
              <TableRowsIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>

          {/* 语言切换按钮 */}
          <IconButton 
            onClick={handleLanguageClick} 
            color="inherit"
            size="small"
            sx={{ p: { xs: 0.5, sm: 1 } }}
          >
            <LanguageIcon fontSize="small" />
          </IconButton>
          <Menu
            anchorEl={langAnchor}
            open={Boolean(langAnchor)}
            onClose={handleLanguageClose}
          >
            {languages.map((lang) => (
              <MenuItem
                key={lang.code}
                selected={i18n.language === lang.code}
                onClick={() => handleLanguageChange(lang.code)}
              >
                {lang.name}
              </MenuItem>
            ))}
          </Menu>

          {/* 深色模式切换按钮 */}
          <IconButton 
            onClick={onDarkModeToggle} 
            color="inherit"
            size="small"
            sx={{ p: { xs: 0.5, sm: 1 } }}
          >
            {darkMode ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
