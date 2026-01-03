const NavPointSchema = new mongoose.Schema({
    name: { type: String, required: true },
    floor_number: { type: Number, required: true },
    poi_type: { type: String }, // e.g., 'Radiology', 'Restroom', 'Elevator'

    // GeoJSON Point for Coordinates (Required for spatial querying)
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number], // [longitude, latitude] or [x, y] in a local system
            required: true
        }
    }
});

// Create a 2dsphere index for geospatial queries
NavPointSchema.index({ location: '2dsphere' });

// module.exports = mongoose.model('NavPoint', NavPointSchema);