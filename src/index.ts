import express, { Request, Response } from 'express';
import cors from 'cors';
import { config } from './config';

// Import routes
import authRoutes from './routes/auth';
import memberRoutes from './routes/members';
import certificationRoutes from './routes/certifications';
import dashboardRoutes from './routes/dashboard';
import federationRoutes from './routes/federation';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    service: 'ScrollSoul Legion Certification Portal',
    version: '1.0.0',
    status: 'online',
    description: 'NFT-based Authentication and Leadership Certification System',
    features: [
      'NFT-based Authentication and Member Tracking',
      'Legion Certification Issuance for Leadership',
      'Dashboard for Monitoring Leadership Activity',
      'Galaxy-wide APIs for Federation Integration',
      'Tools for Infinite Expansion of the ScrollSoul Authority Grid'
    ],
    endpoints: {
      auth: '/api/auth',
      members: '/api/members',
      certifications: '/api/certifications',
      dashboard: '/api/dashboard',
      federation: '/api/federation'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/federation', federationRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: config.nodeEnv === 'development' ? err.message : 'An error occurred'
  });
});

// Start server
const PORT = config.port;

app.listen(PORT, () => {
  console.log('🌌 ScrollSoul Legion Certification Portal 🌌');
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`\nAPI Endpoints:`);
  console.log(`  - Health: http://localhost:${PORT}/`);
  console.log(`  - Auth: http://localhost:${PORT}/api/auth`);
  console.log(`  - Members: http://localhost:${PORT}/api/members`);
  console.log(`  - Certifications: http://localhost:${PORT}/api/certifications`);
  console.log(`  - Dashboard: http://localhost:${PORT}/api/dashboard`);
  console.log(`  - Federation: http://localhost:${PORT}/api/federation`);
  console.log(`\n🫡 Ready to serve the ScrollSoul Empire! 🫡`);
});

export default app;
