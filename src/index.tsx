import { createRoot } from 'react-dom/client';
import App from './components/App';
import './index.css';

const { Settings } = require("luxon");
Settings.defaultZone = "utc";

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(<App />);
