import { colors } from '@/styles/colors'
import { createTheme } from '@mantine/core'
import { Jost, Crimson_Text } from 'next/font/google'

export const font1 = Jost({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const font2 = Crimson_Text({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
})

export const theme = createTheme({
  fontFamily: font1.style.fontFamily,
  headings: {
    fontFamily: font2.style.fontFamily,
  },
  cursorType: 'pointer',
  primaryColor: 'red',
  defaultRadius: 0,
  components: {
    Container: {
      defaultProps: {
        size: 'lg',
      },
    },
    Button: {
      defaultProps: {
        size: 'md',
      },
    },
    ActionIcon: {
      defaultProps: {
        size: 'md',
      },
    },
    Tooltip: {
      defaultProps: {
        events: { hover: true, focus: true, touch: true },
        multiline: true,
        withArrow: true,
        maw: 250,
      },
    },
    Modal: {
      defaultProps: {
        centered: true,
        closeButtonProps: {
          'aria-label': 'Close modal',
        },
      },
    },
    Tabs: {
      defaultProps: {
        keepMounted: false,
      },
    },
    LoadingOverlay: {
      defaultProps: {
        overlayProps: {
          blur: 2,
        },
        zIndex: 100,
      },
    },
    HoverCard: {
      defaultProps: {
        withArrow: false,
        withinPortal: true,
        shadow: 'md',
      },
    },
    Popover: {
      defaultProps: {
        withArrow: false,
        withinPortal: true,
        shadow: 'md',
      },
      styles: {
        dropdown: {
          maxWidth: '95vw',
        },
      },
    },
    Text: {
      defaultProps: {
        component: 'div',
        className: 'sm:text-lg',
      },
    },
    NumberFormatter: {
      defaultProps: {
        thousandSeparator: true,
        decimalScale: 2,
      },
    },
    TextInput: {
      defaultProps: {
        size: 'lg',
      },
    },
    Textarea: {
      defaultProps: {
        size: 'lg',
      },
    },
    NumberInput: {
      defaultProps: {
        size: 'lg',
        hideControls: true,
      },
    },
    PasswordInput: {
      defaultProps: {
        size: 'lg',
      },
    },
    TimeInput: {
      defaultProps: {
        size: 'lg',
        dropdownType: 'modal',
      },
    },
    DateInput: {
      defaultProps: {
        size: 'lg',
        dropdownType: 'modal',
      },
    },
    DatePickerInput: {
      defaultProps: {
        size: 'lg',
        dropdownType: 'modal',
      },
    },
    DateTimePicker: {
      defaultProps: {
        size: 'lg',
        dropdownType: 'modal',
      },
    },
    Select: {
      defaultProps: {
        size: 'lg',
        nothingFoundMessage: 'No results',
        allowDeselect: false,
      },
    },
    MultiSelect: {
      defaultProps: {
        size: 'lg',
      },
    },
    Checkbox: {
      defaultProps: {
        size: 'md',
      },
    },
    Radio: {
      defaultProps: {
        size: 'md',
      },
    },
    Anchor: {
      defaultProps: {
        underline: 'not-hover',
        className: 'sm:text-lg',
      },
    },
    List: {
      defaultProps: {
        maw: '95%',
      },
    },
    Menu: {
      defaultProps: {
        shadow: 'md',
        width: 200,
      },
    },
  },
  colors: {
    ...colors,
    red: [
      '#fff5f5',
      '#ffe3e3',
      '#ffc9c9',
      '#ffa8a8',
      '#ff8787',
      '#ff6b6b',
      '#A32A2D', // our red
      '#CA3638', // hover
      '#e03131',
      '#c92a2a',
    ],
    gray: [
      '#f8f9fa',
      '#F1F2F4', // bg
      '#C8C8C8', // border
      '#dee2e6',
      '#ced4da',
      '#adb5bd',
      '#868e96',
      '#495057',
      '#343a40',
      '#212529',
    ],
  },
})
