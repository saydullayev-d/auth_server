const express = require('express');
const { PrismaClient } = require('@prisma/client');
const {
  createOrganization,
  getOrganizationById,
  getAllOrganizations,
  updateOrganization,
  deleteOrganization,
} = require('./services/organizationService');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'file:./dev.db',
});

app.use(cors());
app.use(express.json());

// Create
app.post('/organizations', async (req, res) => {
  try {
    const organization = await createOrganization(req.body);
    res.status(201).json(organization);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Read (все с пагинацией)
app.get('/organizations', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Update getAllOrganizations to support pagination
    const organizations = await prisma.organization.findMany({
      skip,
      take: limit,
    });
    const total = await prisma.organization.count();

    res.json({
      data: organizations,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read (по ID)
app.get('/organizations/:id', async (req, res) => {
  try {
    const organization = await getOrganizationById(req.params.id);
    res.json(organization);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Update
app.put('/organizations/:id', async (req, res) => {
  try {
    const organization = await updateOrganization(req.params.id, req.body);
    res.json(organization);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete
app.delete('/organizations/:id', async (req, res) => {
  try {
    const result = await deleteOrganization(req.params.id);
    res.json(result);
  } catch (error) {
    catalogues
    res.status(404).json({ error: error.message });
  }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});

(async () => {
  try {
    // Prisma doesn't require sync; migrations handle table creation
    console.log('Prisma client connected');
    app.listen(6575, () => console.log('Сервер запущен на http://localhost:8000'));
  } catch (error) {
    console.error('Ошибка запуска сервера:', error);
    await prisma.$disconnect();
  }
})();