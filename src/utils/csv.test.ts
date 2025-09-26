import { describe, expect, it } from 'vitest';
import { parseCsv } from './csv';

describe('parseCsv', () => {
  it('parses simple csv', () => {
    const csv = 'date,amount,desc\n2025-01-01,10,Lunch\n2025-01-02,-20,Groceries';
    const res = parseCsv(csv);
    expect(res.headers).toEqual(['date', 'amount', 'desc']);
    expect(res.rows.length).toBe(2);
    expect(res.rows[0]).toEqual(['2025-01-01', '10', 'Lunch']);
  });

  it('handles quoted fields with commas', () => {
    const csv = 'date,amount,desc\n2025-01-01,10,"Lunch, with friends"';
    const res = parseCsv(csv);
    expect(res.rows[0][2]).toBe('Lunch, with friends');
  });
});



