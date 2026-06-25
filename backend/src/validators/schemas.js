const Joi = require('joi');

const authSchemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().required(),
    role: Joi.string().valid('customer', 'technician', 'admin').required(),
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

const bookingSchemas = {
  create: Joi.object({
    customerId: Joi.string().required(),
    technicianId: Joi.string().optional(),
    serviceId: Joi.string().required(),
    description: Joi.string().optional(),
    location: Joi.string().required(),
    scheduledDate: Joi.date().required(),
    budget: Joi.number().positive().required(),
  }),
  update: Joi.object({
    status: Joi.string().valid('pending', 'accepted', 'in-progress', 'completed', 'cancelled'),
    technicianNotes: Joi.string().optional(),
  }),
  accept: Joi.object({
    quotedPrice: Joi.number().positive().required(),
  }),
};

const technicianSchemas = {
  update: Joi.object({
    name: Joi.string().optional(),
    phone: Joi.string().optional(),
    specialization: Joi.string().optional(),
    bio: Joi.string().optional(),
    yearsOfExperience: Joi.number().optional(),
    hourlyRate: Joi.number().optional(),
    serviceRadius: Joi.number().optional(),
    availability: Joi.object().optional(),
  }),
  setAvailability: Joi.object({
    available: Joi.boolean().required(),
    availableFrom: Joi.date().optional(),
    availableUntil: Joi.date().optional(),
  }),
};

const reviewSchemas = {
  create: Joi.object({
    bookingId: Joi.string().required(),
    technicianId: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().optional(),
  }),
};

const serviceSchemas = {
  create: Joi.object({
    name: Joi.string().required(),
    category: Joi.string().required(),
    description: Joi.string().optional(),
    basePrice: Joi.number().positive().required(),
    icon: Joi.string().optional(),
  }),
};

module.exports = {
  authSchemas,
  bookingSchemas,
  technicianSchemas,
  reviewSchemas,
  serviceSchemas,
};
