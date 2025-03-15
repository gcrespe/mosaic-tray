import React, { useState, useEffect } from 'react';
import { NewEvent } from '../mainContent/MainContent';
import './EventModal.css';

interface EventModalProps {
  onSave: (event: NewEvent) => void;
  onCancel: () => void;
  selectedDate: Date | null;
}

const EventModal: React.FC<EventModalProps> = ({ onSave, onCancel, selectedDate }) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [timeInput, setTimeInput] = useState<string>('12:00');
  
  // Sugestões de horários comuns no formato 24h
  const timeSuggestions = [
    '09:00', '12:00', '15:00', '18:00'
  ];
  
  // Formata a entrada de tempo conforme o usuário digita
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Permite entrada vazia
    if (!value.trim()) {
      setTimeInput('');
      return;
    }
    
    // Se o usuário estiver apagando texto, não reformatar
    if (value.length < timeInput.length) {
      setTimeInput(value);
      return;
    }
    
    // Trata a entrada direta de dois pontos
    if (value.includes(':') && !timeInput.includes(':')) {
      setTimeInput(value);
      return;
    }
    
    // Extrai apenas os números para processamento
    const numbersOnly = value.replace(/[^0-9]/g, '');
    
    // Para entrada inicial (1 ou 2 números) - apenas mostrar os números
    if (/^\d{1,2}$/.test(value)) {
      const hours = parseInt(value, 10);
      if (hours >= 0 && hours <= 23) {
        setTimeInput(value);
      } else {
        setTimeInput('00');
      }
      return;
    }
    
    // Se o usuário estiver inserindo o formato hora:minuto
    if (/^\d{1,2}:\d{0,2}$/.test(value)) {
      const [hourStr, minStr] = value.split(':');
      const hour = parseInt(hourStr, 10);
      
      if (hour >= 0 && hour <= 23) {
        setTimeInput(value);
      } else {
        // Corrige horas inválidas
        const fixedHour = Math.min(Math.max(hour, 0), 23);
        setTimeInput(`${fixedHour.toString().padStart(2, '0')}:${minStr}`);
      }
      return;
    }
    
    // Se estiver digitando algo mais, use nosso formatador automático para números
    if (numbersOnly.length <= 2) {
      const hours = parseInt(numbersOnly, 10);
      if (hours >= 0 && hours <= 23) {
        setTimeInput(hours.toString().padStart(2, '0'));
      } else {
        setTimeInput('00');
      }
    } else if (numbersOnly.length <= 4) {
      let hours = parseInt(numbersOnly.substring(0, 2), 10);
      hours = Math.min(Math.max(hours, 0), 23);
      
      if (numbersOnly.length === 3) {
        // Se forem apenas 3 dígitos, formato simples com um único dígito de minuto
        setTimeInput(`${hours.toString().padStart(2, '0')}:${numbersOnly.charAt(2)}`);
      } else {
        // Todos os 4 dígitos, formatado como hora:minuto
        let minutes = parseInt(numbersOnly.substring(2, 4), 10);
        minutes = Math.min(minutes, 59);
        setTimeInput(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
      }
    }
  };
  
  // Adicionar efeito para autocompletar o formato de hora
  useEffect(() => {
    // Se tivermos apenas horas, adicione o resto depois de um pequeno atraso
    if (/^\d{1,2}$/.test(timeInput)) {
      const timer = setTimeout(() => {
        setTimeInput(current => {
          if (/^\d{1,2}$/.test(current)) {
            const hours = parseInt(current, 10);
            return `${hours.toString().padStart(2, '0')}:00`;
          }
          return current;
        });
      }, 1500); // 1.5 segundos
      return () => clearTimeout(timer);
    }
  }, [timeInput]);
  
  // Atualiza o horário quando uma sugestão é clicada
  const handleTimeSuggestion = (time: string) => {
    setTimeInput(time);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === '') return;
    
    try {
      // Processar a hora no formato 24h
      let formattedTime = timeInput;
      
      // Se não houver dois pontos, adicione ":00"
      if (!formattedTime.includes(':')) {
        const hours = parseInt(formattedTime, 10);
        formattedTime = `${hours.toString().padStart(2, '0')}:00`;
      } else {
        // Garante que as horas e minutos sejam formatados corretamente
        const [hourStr, minuteStr] = formattedTime.split(':');
        const hours = parseInt(hourStr, 10);
        const minutes = parseInt(minuteStr, 10) || 0;
        
        // Validar e formatar hora corretamente
        const validHours = Math.min(Math.max(hours, 0), 23);
        const validMinutes = Math.min(Math.max(minutes, 0), 59);
        
        formattedTime = `${validHours.toString().padStart(2, '0')}:${validMinutes.toString().padStart(2, '0')}`;
      }
      
      onSave({
        title,
        description,
        time: formattedTime
      });
    } catch (error) {
      // Se houver um erro na análise do tempo, use um tempo padrão
      onSave({
        title,
        description,
        time: '12:00' // Padrão para meio-dia
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Adicionar Novo Evento</h2>
          <button type="button" className="close-button" onClick={onCancel}>×</button>
        </div>
        
        {selectedDate && (
          <p className="modal-date">
            {selectedDate.toLocaleDateString('pt-BR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="event-title">Título</label>
            <input
              id="event-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Qual é o evento?"
              required
              autoFocus
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="event-time">Horário (formato 24h)</label>
            <div className="time-input-container">
              <div className="time-input-wrapper">
                <span className="time-icon">🕒</span>
                <input
                  id="event-time"
                  type="text"
                  value={timeInput}
                  onChange={handleTimeChange}
                  placeholder="14:30"
                  className="time-input"
                />
              </div>
              
              <div className="time-suggestions">
                {timeSuggestions.map(time => (
                  <button
                    key={time}
                    type="button"
                    className="time-chip"
                    onClick={() => handleTimeSuggestion(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="event-description">Descrição</label>
            <textarea
              id="event-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione detalhes (opcional)"
              rows={3}
            />
          </div>
          
          <div className="modal-buttons">
            <button type="button" className="cancel-button" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="save-button">
              Salvar Evento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;