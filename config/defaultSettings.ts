import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'Nexter',
  pwa: false,
  logo: 'http://www.gonexter.com/_next/static/images/logo-9374d9d71c8962cefbe44ee2d0c48233.svg',
  iconfontUrl: '',
};

export default Settings;
