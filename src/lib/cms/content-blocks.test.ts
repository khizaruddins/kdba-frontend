import { describe, it, expect } from 'vitest';
import {
  createBlock,
  blocksToText,
  countWords,
  estimateReadTime,
  ContentBlock,
} from './content-blocks';

describe('ContentBlock Utilities', () => {
  it('creates default blocks with proper ids and types', () => {
    const p = createBlock('paragraph');
    expect(p.type).toBe('paragraph');
    expect(p.id).toBeDefined();

    const h2 = createBlock('heading2');
    expect(h2.type).toBe('heading2');

    const img = createBlock('image');
    expect(img.type).toBe('image');
  });

  it('correctly extracts plain text from varied blocks', () => {
    const blocks: ContentBlock[] = [
      { id: '1', type: 'heading2', text: 'Introduction to Gym 360' },
      { id: '2', type: 'paragraph', html: 'Welcome to our <strong>new</strong> fitness studio.' },
      { id: '3', type: 'quote', text: 'Fitness is a journey, not a destination.', attribution: 'Coach' },
      { id: '4', type: 'bullet-list', items: ['Cardio', 'Strength', 'Recovery'] },
    ];

    const text = blocksToText(blocks);
    expect(text).toContain('Introduction to Gym 360');
    expect(text).toContain('Welcome to our new fitness studio.');
    expect(text).toContain('Fitness is a journey, not a destination.');
    expect(text).toContain('Cardio Strength Recovery');
    // Ensure HTML tags were stripped
    expect(text).not.toContain('<strong>');
  });

  it('accurately counts words and estimates reading time', () => {
    const shortBlocks: ContentBlock[] = [
      { id: '1', type: 'paragraph', html: 'One two three four five six seven eight nine ten.' },
    ];
    expect(countWords(shortBlocks)).toBe(10);
    expect(estimateReadTime(shortBlocks)).toBe(1);

    // 400 words should be ~2 min read
    const words400 = Array(400).fill('word').join(' ');
    const longBlocks: ContentBlock[] = [
      { id: '1', type: 'paragraph', html: words400 },
    ];
    expect(countWords(longBlocks)).toBe(400);
    expect(estimateReadTime(longBlocks)).toBe(2);
  });
});
