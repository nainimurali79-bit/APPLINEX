const mongoose = require('mongoose');

const ApplianceSchema = new mongoose.Schema({
  product_id: { type: String, required: true, unique: true, index: true },
  category: { type: String, required: true, index: true },
  category_slug: { type: String, required: true, index: true },
  subcategory: { type: String, required: true },
  brand: { type: String, required: true, index: true },
  model: { type: String, required: true },
  product_name: { type: String, required: true, text: true },
  description: { type: String, required: true },
  capacity: { type: String, default: '' },
  energy_rating: { type: String, default: '5 Star' },
  compressor_type: { type: String, default: '' },
  cooling_technology: { type: String, default: '' },
  colour: { type: String, default: 'Silver / Inox' },
  dimensions: { type: String, default: '' },
  weight: { type: String, default: '' },
  warranty: { type: String, required: true },
  
  // Rental Pricing & Inventory
  purchase_price: { type: Number, required: true },
  monthly_rent: { type: Number, required: true, index: true },
  security_deposit: { type: Number, required: true },
  min_tenure_months: { type: Number, default: 3 },
  availability_status: { type: String, enum: ['Available', 'Rented', 'Maintenance'], default: 'Available', index: true },
  quantity: { type: Number, default: 10 },
  condition: { type: String, default: 'Brand New' },
  rating: { type: Number, default: 4.8 },
  review_count: { type: Number, default: 0 },
  
  // Media & URLs
  image_url: { type: String, required: true },
  gallery_images: [{ type: String }],
  official_product_url: { type: String, required: true },
  
  // Flexible Specifications & Features
  features: [{ type: String }],
  specifications: { type: Map, of: String },
  
  // AI & Demand Forecasting Metadata
  ai_metadata: {
    demand_score: { type: Number, default: 85 },
    season: { type: String, default: 'Year-round' },
    utilization_rate: { type: Number, default: 0.85 },
    target_persona: { type: String, default: 'General Household' }
  }
}, {
  timestamps: true
});

ApplianceSchema.index({ product_name: 'text', description: 'text', brand: 'text' });

module.exports = mongoose.model('Appliance', ApplianceSchema);
