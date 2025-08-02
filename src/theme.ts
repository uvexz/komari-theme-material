import { createTheme, ThemeOptions } from '@mui/material/styles';
import { ColorTheme } from './types';

const colorThemes = {
  blue: {
    light: '#1976d2',
    dark: '#90caf9',
  },
  red: {
    light: '#d32f2f',
    dark: '#f44336',
  },
  yellow: {
    light: '#f57c00',
    dark: '#ffb74d',
  },
  green: {
    light: '#388e3c',
    dark: '#66bb6a',
  },
  cyan: {
    light: '#0097a7',
    dark: '#4dd0e1',
  },
  indigo: {
    light: '#303f9f',
    dark: '#7986cb',
  },
  purple: {
    light: '#7b1fa2',
    dark: '#ba68c8',
  },
};

const getDesignTokens = (mode: 'light' | 'dark', colorTheme: ColorTheme = 'blue'): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      main: colorThemes[colorTheme][mode],
    },
    secondary: {
      main: mode === 'light' ? '#dc004e' : '#f48fb1',
    },
    background: {
      default: mode === 'light' ? '#f5f5f5' : '#121212',
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
    },
    success: {
      main: mode === 'light' ? '#2e7d32' : '#66bb6a',
    },
    warning: {
      main: mode === 'light' ? '#ed6c02' : '#ffa726',
    },
    error: {
      main: mode === 'light' ? '#d32f2f' : '#f44336',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 2, // 全局设置所有组件的圆角为 2px
  },
  components: {
    // AppBar
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    // 卡片组件
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          boxShadow: mode === 'light'
            ? '0 2px 8px rgba(0,0,0,0.1)'
            : '0 2px 8px rgba(0,0,0,0.3)',
        },
      },
    },
    // 按钮组件
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          textTransform: 'none',
        },
      },
    },
    // 纸张组件
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          boxShadow: mode === 'light'
            ? '0 2px 8px rgba(0,0,0,0.1)'
            : '0 2px 8px rgba(0,0,0,0.3)',
        },
      },
    },
    // 输入框组件
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 2,
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: 2,
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          borderRadius: 2,
        },
      },
    },
    // 选择框组件
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 2,
        },
      },
    },
    // 芯片组件
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 2,
        },
      },
    },
    // 对话框组件
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 2,
        },
      },
    },
    // 菜单组件
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 2,
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          borderRadius: 2,
        },
      },
    },
    // 抽屉组件
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: 2,
        },
      },
    },
    // 工具提示组件
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 2,
        },
      },
    },
    // 警告组件
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 2,
        },
      },
    },
    // 骨架屏组件
    MuiSkeleton: {
      styleOverrides: {
        root: {
          borderRadius: 2,
        },
      },
    },
    // 进度条组件
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 2,
        },
      },
    },
    // 切换按钮组件
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 2,
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          borderRadius: 2,
        },
      },
    },
    // 分页组件
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          borderRadius: 2,
        },
      },
    },
    // 表格组件
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 2,
        },
      },
    },
    // 徽章组件
    MuiBadge: {
      styleOverrides: {
        badge: {
          borderRadius: 2,
        },
      },
    },
    // 头像组件
    MuiAvatar: {
      styleOverrides: {
        root: {
          borderRadius: 2,
        },
      },
    },
    // 浮动操作按钮
    MuiFab: {
      styleOverrides: {
        root: {
          borderRadius: 2,
        },
      },
    },
    // 速度拨号组件
    MuiSpeedDial: {
      styleOverrides: {
        fab: {
          borderRadius: 2,
        },
      },
    },
    // 底部导航组件
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          borderRadius: 2,
        },
      },
    },
    // 步骤器组件
    MuiStepConnector: {
      styleOverrides: {
        line: {
          borderRadius: 2,
        },
      },
    },
    // 滑块组件
    MuiSlider: {
      styleOverrides: {
        thumb: {
          borderRadius: 2,
        },
        track: {
          borderRadius: 2,
        },
        rail: {
          borderRadius: 2,
        },
      },
    },
  },
});

export const createAppTheme = (mode: 'light' | 'dark', colorTheme: ColorTheme = 'blue') =>
  createTheme(getDesignTokens(mode, colorTheme));