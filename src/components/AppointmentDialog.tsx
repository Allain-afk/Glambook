import React, { useState } from 'react';
import { Calendar, Clock, User, Scissors, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { localData } from '../lib/localApi';

interface AppointmentDialogProps {
  trigger: React.ReactNode;
  onAppointmentCreated?: (appointment: any) => void;
}

export default function AppointmentDialog({ trigger, onAppointmentCreated }: AppointmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    service: '',
    stylist: '',
    date: '',
    time: '',
    duration: '60',
    price: '',
    notes: ''
  });

  const services = [
    'Hair Cut & Style',
    'Hair Color',
    'Hair Color & Cut',
    'Highlights',
    'Perm',
    'Hair Treatment',
    'Facial Treatment',
    'Manicure',
    'Pedicure',
    'Eyebrow Shaping',
    'Makeup Application',
    'Beard Trim',
    'Full Hair Styling'
  ];

  const stylists = [
    'Emma Wilson',
    'Carlos Rodriguez',
    'Sophia Kim',
    'Marcus Thompson',
    'Isabella Chen',
    'David Martinez'
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const appointmentData = {
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientPhone: formData.clientPhone,
        service: formData.service,
        stylist: formData.stylist,
        date: formData.date,
        time: formData.time,
        duration: `${formData.duration}m`,
        price: parseFloat(formData.price) || 0,
        notes: formData.notes
      };

      const created = await localData.createAppointment(appointmentData as any);
      toast.success('Appointment created successfully!');
      setOpen(false);
      setFormData({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        service: '',
        stylist: '',
        date: '',
        time: '',
        duration: '60',
        price: '',
        notes: ''
      });
      if (onAppointmentCreated) {
        onAppointmentCreated(created);
      }
    } catch (error) {
      console.error('Create appointment error:', error);
      toast.error('Failed to create appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>New Appointment</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Client Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientName">Client Name *</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="clientEmail">Email</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="clientPhone">Phone Number</Label>
                <Input
                  id="clientPhone"
                  type="tel"
                  value={formData.clientPhone}
                  onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Service Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Scissors className="w-4 h-4" />
              <span>Service Details</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="service">Service *</Label>
                <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="stylist">Stylist *</Label>
                <Select value={formData.stylist} onValueChange={(value) => setFormData({ ...formData, stylist: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a stylist" />
                  </SelectTrigger>
                  <SelectContent>
                    {stylists.map((stylist) => (
                      <SelectItem key={stylist} value={stylist}>
                        {stylist}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Select value={formData.duration} onValueChange={(value) => setFormData({ ...formData, duration: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="150">2.5 hours</SelectItem>
                    <SelectItem value="180">3 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="price">Price (PHP)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    className="pl-10"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Scheduling */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Schedule</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="time">Time *</Label>
                <Select value={formData.time} onValueChange={(value) => setFormData({ ...formData, time: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any special requests or notes..."
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-purple-600 to-pink-600"
              disabled={loading || !formData.clientName || !formData.service || !formData.stylist || !formData.date || !formData.time}
            >
              {loading ? 'Creating...' : 'Create Appointment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}