import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Fonts, FontSizes } from '../constants/Typography';

interface Props {
  visible: boolean;
  value?: string;      // YYYY-MM-DD
  minDate?: string;    // YYYY-MM-DD — dates before this are disabled
  title?: string;
  onConfirm: (date: string) => void;
  onClose: () => void;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

function toDateStr(y: number, m: number, d: number) {
  return `${y}-${pad(m + 1)}-${pad(d)}`;
}

export default function DatePickerModal({
  visible, value, minDate, title = 'Select Date', onConfirm, onClose,
}: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parseDate = (s?: string) => {
    if (!s) return today;
    const d = new Date(s);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const initial = parseDate(value || '');
  const [month, setMonth] = useState(initial.getMonth());
  const [year, setYear]   = useState(initial.getFullYear());
  const [selected, setSelected] = useState(value || '');

  // Reset when modal opens
  useEffect(() => {
    if (visible) {
      const d = parseDate(value);
      setMonth(d.getMonth());
      setYear(d.getFullYear());
      setSelected(value || '');
    }
  }, [visible, value]);

  const minD = parseDate(minDate);

  const firstDay     = new Date(year, month, 1).getDay();
  const daysInMonth  = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const isDisabled = (d: number) => {
    const dt = new Date(toDateStr(year, month, d));
    dt.setHours(0, 0, 0, 0);
    return dt < minD;
  };
  const isSelected = (d: number) => toDateStr(year, month, d) === selected;
  const isTodayDay = (d: number) =>
    toDateStr(year, month, d) ===
    `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  // Build grid: leading nulls for offset, then day numbers
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  // Pad to full rows
  while (cells.length % 7 !== 0) cells.push(null);

  const handleConfirm = () => {
    if (!selected) return;
    onConfirm(selected);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Tap backdrop to dismiss */}
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <View style={styles.sheet}>
          {/* Handle bar */}
          <View style={styles.handle} />

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Month / Year nav */}
          <View style={styles.nav}>
            <TouchableOpacity style={styles.navBtn} onPress={prevMonth} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={22} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.monthYear}>
              {MONTHS[month]} {year}
            </Text>
            <TouchableOpacity style={styles.navBtn} onPress={nextMonth} activeOpacity={0.7}>
              <Ionicons name="chevron-forward" size={22} color={Colors.text} />
            </TouchableOpacity>
          </View>

          {/* Day-of-week labels */}
          <View style={styles.row}>
            {DAYS.map((d) => (
              <Text key={d} style={styles.dayLabel}>{d}</Text>
            ))}
          </View>

          {/* Calendar grid */}
          <View style={styles.grid}>
            {cells.map((day, i) => {
              if (!day) return <View key={i} style={styles.cell} />;
              const disabled  = isDisabled(day);
              const sel       = isSelected(day);
              const todayCell = isTodayDay(day);
              return (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.cell,
                    sel       && styles.cellSelected,
                    todayCell && !sel && styles.cellToday,
                  ]}
                  onPress={() => !disabled && setSelected(toDateStr(year, month, day))}
                  disabled={disabled}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.cellText,
                      disabled  && styles.cellDisabledText,
                      sel       && styles.cellSelectedText,
                      todayCell && !sel && styles.cellTodayText,
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Confirm button */}
          <TouchableOpacity
            style={[styles.confirmBtn, !selected && styles.confirmBtnDisabled]}
            onPress={handleConfirm}
            disabled={!selected}
            activeOpacity={0.85}
          >
            <Text style={styles.confirmText}>
              {selected ? `Confirm — ${selected}` : 'Select a date'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const CELL = 44;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.neutral[300],
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: Fonts.pacifico,
    fontSize: FontSizes.xl,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  navBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: Colors.neutral[100],
  },
  monthYear: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.base,
    color: Colors.text,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dayLabel: {
    flex: 1,
    textAlign: 'center',
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    paddingVertical: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  cell: {
    width: `${100 / 7}%` as any,
    height: CELL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellSelected: {
    backgroundColor: Colors.neutral[900],
    borderRadius: CELL / 2,
  },
  cellToday: {
    borderRadius: CELL / 2,
    borderWidth: 1.5,
    borderColor: Colors.amber[500],
  },
  cellText: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
  cellDisabledText: {
    color: Colors.neutral[300],
  },
  cellSelectedText: {
    color: Colors.white,
    fontFamily: Fonts.notoSansSemiBold,
  },
  cellTodayText: {
    color: Colors.amber[600],
    fontFamily: Fonts.notoSansSemiBold,
  },
  confirmBtn: {
    backgroundColor: Colors.neutral[900],
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmBtnDisabled: {
    backgroundColor: Colors.neutral[300],
  },
  confirmText: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.base,
    color: Colors.white,
  },
});
