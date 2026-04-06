const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  origin: String,
  destination: String,
  waypoints: [String],
  distance: Number,
  duration: Number,
  cost: Number,
  cities: [String],
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['concluído', 'em andamento'], default: 'em andamento' }
});

module.exports = mongoose.model('Route', routeSchema);