import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Button,
  Alert,
} from '@mui/material';
import {
  Palette as ThemeIcon,
  Language as LanguageIcon,
  ColorLens as ColorIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import { ThemeMode, ColorTheme } from '../types';

export const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { themeMode, setThemeMode, colorTheme, setColorTheme } = useTheme();
  const [hasChanges, setHasChanges] = useState(false);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setThemeMode(newTheme);
    setHasChanges(true);
  };

  const handleColorChange = (newColor: ColorTheme) => {
    setColorTheme(newColor);
    setHasChanges(true);
  };

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem('i18nextLng', language);
  };

  const handleSave = () => {
    // 刷新页面以确保主题生效
    window.location.reload();
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('settings')}
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <ThemeIcon sx={{ mr: 2 }} />
          <Typography variant="h6">{t('theme')}</Typography>
        </Box>

        <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel>{t('theme')}</InputLabel>
          <Select
            value={themeMode}
            label={t('theme')}
            onChange={(e) => handleThemeChange(e.target.value as ThemeMode)}
          >
            <MenuItem value="light">{t('light')}</MenuItem>
            <MenuItem value="dark">{t('dark')}</MenuItem>
            <MenuItem value="system">{t('system')}</MenuItem>
          </Select>
        </FormControl>

        <Divider sx={{ my: 3 }} />

        <Box display="flex" alignItems="center" mb={3}>
          <ColorIcon sx={{ mr: 2 }} />
          <Typography variant="h6">{t('color_theme')}</Typography>
        </Box>

        <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel>{t('color_theme')}</InputLabel>
          <Select
            value={colorTheme}
            label={t('color_theme')}
            onChange={(e) => handleColorChange(e.target.value as ColorTheme)}
          >
            <MenuItem value="blue">{t('blue')}</MenuItem>
            <MenuItem value="red">{t('red')}</MenuItem>
            <MenuItem value="yellow">{t('yellow')}</MenuItem>
            <MenuItem value="green">{t('green')}</MenuItem>
            <MenuItem value="cyan">{t('cyan')}</MenuItem>
            <MenuItem value="indigo">{t('indigo')}</MenuItem>
            <MenuItem value="purple">{t('purple')}</MenuItem>
          </Select>
        </FormControl>

        <Divider sx={{ my: 3 }} />

        <Box display="flex" alignItems="center" mb={3}>
          <LanguageIcon sx={{ mr: 2 }} />
          <Typography variant="h6">{t('language')}</Typography>
        </Box>

        <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel>{t('language')}</InputLabel>
          <Select
            value={i18n.language}
            label={t('language')}
            onChange={(e) => handleLanguageChange(e.target.value)}
          >
            <MenuItem value="zh-CN">中文</MenuItem>
            <MenuItem value="en-US">English</MenuItem>
          </Select>
        </FormControl>

        {hasChanges && (
          <Alert severity="info" sx={{ mb: 3 }}>
            {t('theme_change_notice')}
          </Alert>
        )}

        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={!hasChanges}
          >
            {t('save_and_refresh')}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};