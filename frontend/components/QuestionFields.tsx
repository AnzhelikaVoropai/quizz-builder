'use client';

import { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { CreateQuizSchema } from '@/lib/schema';

interface Props {
  index: number;
  register: UseFormRegister<CreateQuizSchema>;
  watch: UseFormWatch<CreateQuizSchema>;
  setValue: UseFormSetValue<CreateQuizSchema>;
  errors: FieldErrors<CreateQuizSchema>;
}

export function BooleanFields({ index, register, errors }: Props) {
  const err = errors.questions?.[index];
  return (
    <div className="field">
      <label className="field__label">Правильна відповідь</label>
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.9rem' }}>
          <input type="radio" value="true" {...register(`questions.${index}.correctAnswer`)} />
          Правда
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.9rem' }}>
          <input type="radio" value="false" {...register(`questions.${index}.correctAnswer`)} />
          Неправда
        </label>
      </div>
      {err?.correctAnswer && (
        <span className="field__error">{err.correctAnswer.message as string}</span>
      )}
    </div>
  );
}

export function InputFields({ index, register, errors }: Props) {
  const err = errors.questions?.[index];
  return (
    <div className="field">
      <label className="field__label">Правильна відповідь</label>
      <input
        type="text"
        className={`field__input ${err?.correctAnswer ? 'field__input--error' : ''}`}
        placeholder="Введіть очікувану відповідь"
        {...register(`questions.${index}.correctAnswer`)}
      />
      {err?.correctAnswer && (
        <span className="field__error">{err.correctAnswer.message as string}</span>
      )}
    </div>
  );
}

export function CheckboxFields({ index, watch, setValue, errors }: Props) {
  const optionsRaw = (watch(`questions.${index}.options`) as string | undefined) ?? '[]';
  const correctRaw = (watch(`questions.${index}.correctAnswer`) as string | undefined) ?? '[]';

  const options: string[] = JSON.parse(optionsRaw || '[]');
  const correct: string[] = JSON.parse(correctRaw || '[]');

  const err = errors.questions?.[index];

  function addOption() {
    setValue(`questions.${index}.options`, JSON.stringify([...options, '']));
  }

  function updateOption(i: number, val: string) {
    const updated = options.map((o, idx) => (idx === i ? val : o));
    setValue(`questions.${index}.options`, JSON.stringify(updated));
    if (correct.includes(options[i])) {
      const newCorrect = correct.map((c) => (c === options[i] ? val : c));
      setValue(`questions.${index}.correctAnswer`, JSON.stringify(newCorrect));
    }
  }

  function removeOption(i: number) {
    const removed = options[i];
    setValue(`questions.${index}.options`, JSON.stringify(options.filter((_, idx) => idx !== i)));
    setValue(`questions.${index}.correctAnswer`, JSON.stringify(correct.filter((c) => c !== removed)));
  }

  function toggleCorrect(opt: string) {
    const next = correct.includes(opt)
      ? correct.filter((c) => c !== opt)
      : [...correct, opt];
    setValue(`questions.${index}.correctAnswer`, JSON.stringify(next));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div className="field">
        <label className="field__label">Варіанти відповіді</label>
        {options.map((opt, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
            <input
              type="checkbox"
              checked={correct.includes(opt)}
              onChange={() => toggleCorrect(opt)}
              title="Позначити як правильний"
            />
            <input
              type="text"
              className="field__input"
              value={opt}
              placeholder={`Варіант ${i + 1}`}
              onChange={(e) => updateOption(i, e.target.value)}
            />
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => removeOption(i)}>✕</button>
          </div>
        ))}
        <button type="button" className="btn btn--sm" onClick={addOption} style={{ marginTop: '0.4rem' }}>
          + Додати варіант
        </button>
      </div>
      <p className="text-sm text-muted">☑ — позначте правильні варіанти</p>
      {err?.correctAnswer && (
        <span className="field__error">{err.correctAnswer.message as string}</span>
      )}
    </div>
  );
}