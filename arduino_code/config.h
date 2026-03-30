#ifndef SOFTPWM_COMBINED_H
#define SOFTPWM_COMBINED_H

#include <Arduino.h>
#include <avr/io.h>
#include <avr/interrupt.h>

/* ================= TIMER DEFINITIONS (SoftPWM_timer.h) ================= */

#if defined(__AVR_ATmega32U4__)
#define USE_TIMER4_HS
#elif defined(__arm__) && defined(TEENSYDUINO)
#define USE_INTERVALTIMER
#else
#define USE_TIMER2
#endif

#if defined(USE_TIMER2)

#define SOFTPWM_TIMER_INTERRUPT TIMER2_COMPA_vect
#define SOFTPWM_TIMER_SET(val) (TCNT2 = (val))
#define SOFTPWM_TIMER_INIT(ocr) ({ \
  TIFR2 = (1 << TOV2); \
  TCCR2B = (1 << CS21); \
  TCCR2A = (1 << WGM21); \
  OCR2A = (ocr); \
  TIMSK2 = (1 << OCIE2A); \
})

#elif defined(USE_TIMER4_HS)

#define SOFTPWM_TIMER_INTERRUPT TIMER4_COMPA_vect
#define SOFTPWM_TIMER_SET(val) (TCNT4 = (val))
#define SOFTPWM_TIMER_INIT(ocr) ({ \
  TCCR4A = 0; \
  TCCR4B = 0x04; \
  TCCR4C = 0; \
  TCCR4D = 0; \
  TCCR4E = 0; \
  OCR4C = (ocr); \
  TIMSK4 = (1 << OCIE4A); \
})

#elif defined(USE_INTERVALTIMER)

#define SOFTPWM_TIMER_INTERRUPT softpwm_interval_timer
#ifdef ISR
#undef ISR
#endif
#define ISR(f) void f(void)
#define SOFTPWM_TIMER_SET(val)
#define SOFTPWM_TIMER_INIT(ocr) ({ \
  IntervalTimer *t = new IntervalTimer(); \
  t->begin(softpwm_interval_timer, 1000000.0 / (float)(SOFTPWM_FREQ * 256)); \
})

#endif

/* ================= ORIGINAL DEFINITIONS ================= */

#ifndef SOFTPWM_MAXCHANNELS
#define SOFTPWM_MAXCHANNELS 20
#endif

#define SOFTPWM_NORMAL 0
#define SOFTPWM_INVERTED 1

#if F_CPU
#define SOFTPWM_FREQ 60UL
#define SOFTPWM_OCR (F_CPU/(8UL*256UL*SOFTPWM_FREQ))
#else
#define SOFTPWM_OCR 130
#endif

volatile uint8_t _isr_softcount = 0xff;
uint8_t _softpwm_defaultPolarity = SOFTPWM_NORMAL;

typedef struct
{
  int8_t pin;
  uint8_t polarity;
  volatile uint8_t *outport;
  uint8_t pinmask;
  uint8_t pwmvalue;
  uint8_t checkval;
  uint8_t fadeuprate;
  uint8_t fadedownrate;
} softPWMChannel;

softPWMChannel _softpwm_channels[SOFTPWM_MAXCHANNELS];

/* ================= ISR ================= */

ISR(SOFTPWM_TIMER_INTERRUPT)
{
  uint8_t i;
  int16_t newvalue;
  int16_t direction;

  if(++_isr_softcount == 0)
  {
    for (i = 0; i < SOFTPWM_MAXCHANNELS; i++)
    {
      if (_softpwm_channels[i].fadeuprate > 0 || _softpwm_channels[i].fadedownrate > 0)
      {
        direction = _softpwm_channels[i].pwmvalue - _softpwm_channels[i].checkval;
        newvalue = _softpwm_channels[i].pwmvalue;

        if (direction > 0 && _softpwm_channels[i].fadeuprate > 0)
        {
          newvalue = _softpwm_channels[i].checkval + _softpwm_channels[i].fadeuprate;
          if (newvalue > _softpwm_channels[i].pwmvalue)
            newvalue = _softpwm_channels[i].pwmvalue;
        }
        else if (direction < 0 && _softpwm_channels[i].fadedownrate > 0)
        {
          newvalue = _softpwm_channels[i].checkval - _softpwm_channels[i].fadedownrate;
          if (newvalue < _softpwm_channels[i].pwmvalue)
            newvalue = _softpwm_channels[i].pwmvalue;
        }

        _softpwm_channels[i].checkval = newvalue;
      }
      else
        _softpwm_channels[i].checkval = _softpwm_channels[i].pwmvalue;

      if (_softpwm_channels[i].checkval > 0)
      {
        if (_softpwm_channels[i].polarity == SOFTPWM_NORMAL)
          *_softpwm_channels[i].outport |= _softpwm_channels[i].pinmask;
        else
          *_softpwm_channels[i].outport &= ~(_softpwm_channels[i].pinmask);
      }
    }
  }

  for (i = 0; i < SOFTPWM_MAXCHANNELS; i++)
  {
    if (_softpwm_channels[i].pin >= 0)
    {
      if (_softpwm_channels[i].checkval == _isr_softcount)
      {
        if (_softpwm_channels[i].polarity == SOFTPWM_NORMAL)
          *_softpwm_channels[i].outport &= ~(_softpwm_channels[i].pinmask);
        else
          *_softpwm_channels[i].outport |= (_softpwm_channels[i].pinmask);
      }
    }
  }
}

/* ================= FUNCTIONS ================= */

void SoftPWMBegin(uint8_t defaultPolarity = SOFTPWM_NORMAL)
{
  uint8_t i;

  SOFTPWM_TIMER_INIT(SOFTPWM_OCR);

  for (i = 0; i < SOFTPWM_MAXCHANNELS; i++)
  {
    _softpwm_channels[i].pin = -1;
    _softpwm_channels[i].polarity = SOFTPWM_NORMAL;
    _softpwm_channels[i].outport = 0;
    _softpwm_channels[i].fadeuprate = 0;
    _softpwm_channels[i].fadedownrate = 0;
  }

  _softpwm_defaultPolarity = defaultPolarity;
}

void SoftPWMSet(int8_t pin, uint8_t value, uint8_t hardset = 0)
{
  int8_t firstfree = -1;
  uint8_t i;

  if (hardset)
  {
    SOFTPWM_TIMER_SET(0);
    _isr_softcount = 0xff;
  }

  for (i = 0; i < SOFTPWM_MAXCHANNELS; i++)
  {
    if ((pin < 0 && _softpwm_channels[i].pin >= 0) ||
       (pin >= 0 && _softpwm_channels[i].pin == pin))
    {
      _softpwm_channels[i].pwmvalue = value;

      if (pin >= 0)
        return;
    }

    if (firstfree < 0 && _softpwm_channels[i].pin < 0)
      firstfree = i;
  }

  if (pin >= 0 && firstfree >= 0)
  {
    _softpwm_channels[firstfree].pin = pin;
    _softpwm_channels[firstfree].polarity = _softpwm_defaultPolarity;
    _softpwm_channels[firstfree].outport = portOutputRegister(digitalPinToPort(pin));
    _softpwm_channels[firstfree].pinmask = digitalPinToBitMask(pin);
    _softpwm_channels[firstfree].pwmvalue = value;

    if (_softpwm_defaultPolarity == SOFTPWM_NORMAL)
      digitalWrite(pin, LOW);
    else
      digitalWrite(pin, HIGH);

    pinMode(pin, OUTPUT);
  }
}

#endif