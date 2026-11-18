import { z } from 'zod';
export const states = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'];
export const categories = ['Farmer', 'Student', 'Senior Citizen', 'Woman', 'Entrepreneur', 'Worker', 'Person with Disability', 'General'];
export const languages = ['en', 'hi', 'kn'];
export const profileInput = z.object({ state: z.enum(states), category: z.enum(categories), language: z.enum(languages) }).strict();
