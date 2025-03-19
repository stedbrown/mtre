const sharp = require('sharp');
const fs = require('fs');

const services = [
  { name: 'Garden Design', color: '#3182ce', output: 'public/images/services/garden-design.jpg' },
  { name: 'Irrigation Systems', color: '#006064', output: 'public/images/services/irrigation.jpg' },
  { name: 'Garden Maintenance', color: '#2e7d32', output: 'public/images/services/maintenance.jpg' },
  { name: 'Tree Care', color: '#4b7942', output: 'public/images/services/tree-care.jpg' },
  { name: 'Green Areas', color: '#558b2f', output: 'public/images/services/green-areas.jpg' },
  { name: 'Garden Lighting', color: '#ff9800', output: 'public/images/services/lighting.jpg' }
];

async function generateImages() {
  for (const service of services) {
    try {
      // Genera un'immagine solida colorata
      await sharp({
        create: {
          width: 800,
          height: 600,
          channels: 3,
          background: service.color
        }
      })
      .jpeg()
      .toFile(service.output);
      
      console.log(`Created ${service.output}`);
    } catch (error) {
      console.error(`Error creating ${service.output}:`, error);
    }
  }
}

generateImages(); 