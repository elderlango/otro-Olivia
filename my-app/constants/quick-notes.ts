import type { QuickNote } from '@/types';

export const QUICK_NOTES: QuickNote[] = [
  {
    id: '1',
    label: 'Sin cebolla',
    text: 'Sin cebolla',
  },
  {
    id: '2',
    label: 'Sin cilantro',
    text: 'Sin cilantro',
  },
  {
    id: '3',
    label: 'Extra salsa',
    text: 'Con extra salsa',
  },
  {
    id: '4',
    label: 'Sin picante',
    text: 'Sin picante',
  },
  {
    id: '5',
    label: 'Para llevar',
    text: 'PARA LLEVAR',
  },
  {
    id: '6',
    label: 'Urgente',
    text: '*** URGENTE ***',
  },
  {
    id: '7',
    label: 'Sin sal',
    text: 'Sin sal',
  },
  {
    id: '8',
    label: 'Bien cocido',
    text: 'Bien cocido',
  },
];

export const DEFAULT_PRINTER_SETTINGS = {
  businessName: 'Mi Negocio',
  businessAddress: '',
  businessPhone: '',
  footerMessage: 'Gracias por su compra',
  printCopy: false,
};
