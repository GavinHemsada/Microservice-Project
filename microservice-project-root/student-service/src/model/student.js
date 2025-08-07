const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const bcrypt = require('bcrypt');

const StudentSchema = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    dob: { type: Date, required: true },
    email: { type: String, required: true , unique: true},
    gender: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    }
  },
  {
    timestamps: true
  }
);

StudentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

StudentSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  if (!update) return next();
  update.password = await bcrypt.hash(update.password, 10);
  next();
});


StudentSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Student = model('Student', StudentSchema);

module.exports = Student;
