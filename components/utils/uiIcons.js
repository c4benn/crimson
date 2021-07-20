const path = (points) => {
  const value = [];

  [points].flat(Infinity).forEach((d) => {
    if (typeof d == "object") {
      value.push(d);
    } else value.push({ d });
  });

  return value;
};

export default {
  appLogo: path({
    g: [
      "m209.39 272.17 41.22-127a109 109 0 0 1-12.29 9.62 62.68 62.68 0 0 1-35.32 10.45c-26.63-0.23-53.27 0-79.9-0.12-2.41 0-3.38 0.68-4.14 3-10.83 33.67-21.83 67.28-32.66 101-0.81 2.53-1.93 3.13-4.43 3.12q-39.45-0.14-78.9 0c-3 0-3.51-0.54-2.58-3.39q19.61-59.77 38.96-119.6 14.33-44.1 28.56-88.25c0.75-2.35 1.84-3 4.22-3 56.39 0.07 112.78-0.09 169.17 0.16 13.52 0.06 24.4 6 31.57 18.44 1.71-5.24 3.51-10.18 4.9-15.25 0.72-2.63 1.9-3.37 4.61-3.36q69.71 0.14 139.41 0.06h30.42a57.81 57.81 0 0 1 13.25 1.47c14.18 3.29 20.73 13.11 17.38 27.27-2.66 11.25-6.58 22.18-10.59 33-2.51 6.82-7.95 11.44-14 15.29-7.66 4.91-16.05 8.12-24.73 10.68-1.35 0.4-2.68 0.85-4.55 1.45 7.66 2.8 14.63 5.42 20.15 10.78 5.77 5.61 7.37 12.17 4.87 19.83q-15.3 47.18-30.59 94.27a63.23 63.23 0 0 0-2.74 11.67c-1.27 9.87 2.8 16.88 12.08 20.59 7.39 2.95 15.16 3.36 23 3.37h165.47c4.59 0 4.62 0 3.25 4.24q-16.19 50-32.35 100c-0.74 2.3-1.78 3.06-4.21 3.06q-126.54-0.11-253.08-0.05a35.11 35.11 0 0 1-23.56-8.79c-8.94-7.66-11.57-17.28-8-28.31 10.16-31.77 20.53-63.48 30.86-95.21q18.59-57.1 37.28-114.17c1-3 0.24-3.4-2.61-3.36q-17.72 0.22-35.44 0c-2.54 0-3.66 0.69-4.45 3.14-10.69 33.25-21.55 66.44-32.18 99.7-1.07 3.36-2.46 4.34-5.95 4.32-25.74-0.17-51.49-0.09-77.23-0.09zm-56-142.78c6.24 0 12.47-0.06 18.7 0 1.86 0 2.79-0.55 3.35-2.37q4.77-15.27 9.75-30.47c0.75-2.27 0.32-2.91-2.09-2.89q-18.7 0.14-37.4 0c-1.88 0-2.75 0.56-3.31 2.38q-4.74 15.29-9.71 30.48c-0.72 2.18-0.43 2.93 2 2.88 6.32-0.09 12.52-0.01 18.75-0.01zm242.1-35.65h-40.77c-1.7 0-2 1.11-2.34 2.28-3.4 10.23-6.77 20.48-10.23 30.69-0.66 1.95-0.53 2.77 1.87 2.75q18.7-0.13 37.41 0a2.94 2.94 0 0 0 3.37-2.46c1.59-5.21 3.33-10.37 5-15.55 1.88-5.77 3.75-11.56 5.73-17.71z",
      "m563.88 274.06h-60.5c-6 0-12-0.68-17.63-3.08-13.29-5.63-19.7-18.8-15.38-32.58 7.63-24.29 15.44-48.53 23.26-72.76 2.84-8.79 8.63-15.51 15.87-21 12.68-9.58 26.63-15.4 42.94-14.87 11.91 0.39 23.84 0 35.76 0.13 2.36 0 3.44-0.6 4.21-3 7.18-21.98 14.59-43.9 21.75-65.9 0.79-2.39 1.83-3.25 4.42-3.24q39.95 0.16 79.88 0c3 0 3.17 0.81 2.34 3.35q-21.8 66.89-43.53 133.89c-8.17 25.17-16.36 50.33-24.4 75.54-0.91 2.83-2.2 3.64-5.15 3.62-21.28-0.16-42.56-0.1-63.84-0.1zm-38-72.22h40.27a2.35 2.35 0 0 0 2.56-2c3.39-10.47 6.78-20.95 10.25-31.4 0.6-1.81 0.57-2.58-1.68-2.56-12.59 0.07-25.18 0.05-37.78 0-1.39 0-2.28 0.3-2.74 1.74-3.58 11.28-7.17 22.49-10.91 34.22z",
      "m590.11 421.29c-1.19 5.06-2.33 9.59-3.29 14.15-0.33 1.54-1.08 2.05-2.53 1.91a15.49 15.49 0 0 0-1.67 0q-122 0-244 0.08c-3.25 0-4.27-0.77-4-4a83.72 83.72 0 0 0 0-10c0-1.56 0.41-2.32 2.05-2.12a13.29 13.29 0 0 0 1.67 0h251.77z",
      "m459.7 444q60.82 0 121.65-0.07c2.93 0 3.6 0.61 2.83 3.42a85.12 85.12 0 0 0-2 10.15c-0.28 1.9-1 2.86-3 2.56a8.43 8.43 0 0 0-1.33 0q-119.65 0-239.31 0.08c-3.25 0-4.25-0.78-4-4a83.71 83.71 0 0 0 0-10c0-1.55 0.41-2.29 2.05-2.11a22.82 22.82 0 0 0 2.34 0z",
      "m801.44 33.41a33.44 33.44 0 1 1-33.29-33.41 33.35 33.35 0 0 1 33.29 33.41zm-33.89 28c15.2 0.36 28-11.95 28.39-27.38 0.41-15.17-11.88-28-27.29-28.49-15.24-0.54-28.26 12.03-28.58 27.51-0.32 15.15 12.11 27.95 27.48 28.32z",
      "m749.5 50.82c3.07-9.43 6-18.48 8.94-27.55 0.44-1.4 1.34-1.55 2.53-1.54 7 0 14-0.08 21 0.05 4 0.08 5.33 2 4.23 5.85-2.15 7.45-4 8.81-11.86 8.81-8.38 0-8.38 0-11 7.89-2.12 6.49-2.12 6.49-8.86 6.49zm25-24a32.88 32.88 0 0 0-4.34 0c-2.06 0.29-1.93 2.27-2.11 3.62-0.21 1.66 1.38 0.83 2.18 1 3.68 0.7 3.77-2.05 4.32-4.67z",
    ],
  }),

  tag: path(
    "M5.5,7A1.5,1.5 0 0,1 4,5.5A1.5,1.5 0 0,1 5.5,4A1.5,1.5 0 0,1 7,5.5A1.5,1.5 0 0,1 5.5,7M21.41,11.58L12.41,2.58C12.05,2.22 11.55,2 11,2H4C2.89,2 2,2.89 2,4V11C2,11.55 2.22,12.05 2.59,12.41L11.58,21.41C11.95,21.77 12.45,22 13,22C13.55,22 14.05,21.77 14.41,21.41L21.41,14.41C21.78,14.05 22,13.55 22,13C22,12.44 21.77,11.94 21.41,11.58Z"
  ),

  alertDecagram: path(
    "M23,12L20.56,9.22L20.9,5.54L17.29,4.72L15.4,1.54L12,3L8.6,1.54L6.71,4.72L3.1,5.53L3.44,9.21L1,12L3.44,14.78L3.1,18.47L6.71,19.29L8.6,22.47L12,21L15.4,22.46L17.29,19.28L20.9,18.46L20.56,14.78L23,12M13,17H11V15H13V17M13,13H11V7H13V13Z"
  ),

  hash: path(
    "M5.41,21L6.12,17H2.12L2.47,15H6.47L7.53,9H3.53L3.88,7H7.88L8.59,3H10.59L9.88,7H15.88L16.59,3H18.59L17.88,7H21.88L21.53,9H17.53L16.47,15H20.47L20.12,17H16.12L15.41,21H13.41L14.12,17H8.12L7.41,21H5.41M9.53,9L8.47,15H14.47L15.53,9H9.53Z"
  ),

  shape: path(
    "M11,13.5V21.5H3V13.5H11M12,2L17.5,11H6.5L12,2M17.5,13C20,13 22,15 22,17.5C22,20 20,22 17.5,22C15,22 13,20 13,17.5C13,15 15,13 17.5,13Z"
  ),

  clothHanger: path(
    "M12 4A3.5 3.5 0 0 0 8.5 7.5H10.5A1.5 1.5 0 0 1 12 6A1.5 1.5 0 0 1 13.5 7.5A1.5 1.5 0 0 1 12 9C11.45 9 11 9.45 11 10V11.75L2.4 18.2A1 1 0 0 0 3 20H21A1 1 0 0 0 21.6 18.2L13 11.75V10.85A3.5 3.5 0 0 0 15.5 7.5A3.5 3.5 0 0 0 12 4M12 13.5L18 18H6Z"
  ),

  bookmark: path("M17,3H7A2,2 0 0,0 5,5V21L12,18L19,21V5C19,3.89 18.1,3 17,3Z"),

  bookmarkOutline: path(
    "M17,18L12,15.82L7,18V5H17M17,3H7A2,2 0 0,0 5,5V21L12,18L19,21V5C19,3.89 18.1,3 17,3Z"
  ),

  androidMessage: path(
    "M20,20H7A2,2 0 0,1 5,18V8.94L2.23,5.64C2.09,5.47 2,5.24 2,5A1,1 0 0,1 3,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20M8.5,7A0.5,0.5 0 0,0 8,7.5V8.5A0.5,0.5 0 0,0 8.5,9H18.5A0.5,0.5 0 0,0 19,8.5V7.5A0.5,0.5 0 0,0 18.5,7H8.5M8.5,11A0.5,0.5 0 0,0 8,11.5V12.5A0.5,0.5 0 0,0 8.5,13H18.5A0.5,0.5 0 0,0 19,12.5V11.5A0.5,0.5 0 0,0 18.5,11H8.5M8.5,15A0.5,0.5 0 0,0 8,15.5V16.5A0.5,0.5 0 0,0 8.5,17H13.5A0.5,0.5 0 0,0 14,16.5V15.5A0.5,0.5 0 0,0 13.5,15H8.5Z"
  ),

  carousel: path("M18,6V17H22V6M2,17H6V6H2M7,19H17V4H7V19Z"),

  close: path(
    "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
  ),

  closeCircle: path(
    "M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"
  ),

  check: path("M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"),

  shopping: path(
    "M12,13A5,5 0 0,1 7,8H9A3,3 0 0,0 12,11A3,3 0 0,0 15,8H17A5,5 0 0,1 12,13M12,3A3,3 0 0,1 15,6H9A3,3 0 0,1 12,3M19,6H17A5,5 0 0,0 12,1A5,5 0 0,0 7,6H5C3.89,6 3,6.89 3,8V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V8C21,6.89 20.1,6 19,6Z"
  ),

  chevronLeft: path(
    "M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"
  ),

  chevronRight: path(
    "M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"
  ),

  chevronDown: path(
    "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
  ),

  chevronUp: path(
    "M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"
  ),

  chevronDoubleUp: path(
    "M7.41,18.41L6,17L12,11L18,17L16.59,18.41L12,13.83L7.41,18.41M7.41,12.41L6,11L12,5L18,11L16.59,12.41L12,7.83L7.41,12.41Z"
  ),

  magnify: path(
    "M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
  ),

  eye: path(
    "M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"
  ),

  eyeOff: path(
    "M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z"
  ),

  history: path(
    "M13.5,8H12V13L16.28,15.54L17,14.33L13.5,12.25V8M13,3A9,9 0 0,0 4,12H1L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3"
  ),

  android: path(
    "M16.61 15.15C16.15 15.15 15.77 14.78 15.77 14.32S16.15 13.5 16.61 13.5H16.61C17.07 13.5 17.45 13.86 17.45 14.32C17.45 14.78 17.07 15.15 16.61 15.15M7.41 15.15C6.95 15.15 6.57 14.78 6.57 14.32C6.57 13.86 6.95 13.5 7.41 13.5H7.41C7.87 13.5 8.24 13.86 8.24 14.32C8.24 14.78 7.87 15.15 7.41 15.15M16.91 10.14L18.58 7.26C18.67 7.09 18.61 6.88 18.45 6.79C18.28 6.69 18.07 6.75 18 6.92L16.29 9.83C14.95 9.22 13.5 8.9 12 8.91C10.47 8.91 9 9.24 7.73 9.82L6.04 6.91C5.95 6.74 5.74 6.68 5.57 6.78C5.4 6.87 5.35 7.08 5.44 7.25L7.1 10.13C4.25 11.69 2.29 14.58 2 18H22C21.72 14.59 19.77 11.7 16.91 10.14H16.91Z"
  ),

  minus: path("M19,13H5V11H19V13Z"),

  plus: path("M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"),

  commentQuestion: path(
    "M4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2M12.19,5.5C11.3,5.5 10.59,5.68 10.05,6.04C9.5,6.4 9.22,7 9.27,7.69H11.24C11.24,7.41 11.34,7.2 11.5,7.06C11.7,6.92 11.92,6.85 12.19,6.85C12.5,6.85 12.77,6.93 12.95,7.11C13.13,7.28 13.22,7.5 13.22,7.8C13.22,8.08 13.14,8.33 13,8.54C12.83,8.76 12.62,8.94 12.36,9.08C11.84,9.4 11.5,9.68 11.29,9.92C11.1,10.16 11,10.5 11,11H13C13,10.72 13.05,10.5 13.14,10.32C13.23,10.15 13.4,10 13.66,9.85C14.12,9.64 14.5,9.36 14.79,9C15.08,8.63 15.23,8.24 15.23,7.8C15.23,7.1 14.96,6.54 14.42,6.12C13.88,5.71 13.13,5.5 12.19,5.5M11,12V14H13V12H11Z"
  ),

  axisArrowInfo: path(
    "M12 2L16 6H13V13.85L19.53 17.61L21 15.03L22.5 20.5L17 21.96L18.53 19.35L12 15.58L5.47 19.35L7 21.96L1.5 20.5L3 15.03L4.47 17.61L11 13.85V6H8L12 2M21 5H19V3H21V5M22 10V12H18V10H19V8H18V6H21V10H22Z"
  ),

  message: path(
    "M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4C22,2.89 21.1,2 20,2Z"
  ),

  twitter: path(
    "M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z"
  ),

  whatsapp: path(
    "M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7 8.5 7 9.71C7 10.93 7.89 12.1 8 12.27C8.14 12.44 9.76 14.94 12.25 16C12.84 16.27 13.3 16.42 13.66 16.53C14.25 16.72 14.79 16.69 15.22 16.63C15.7 16.56 16.68 16.03 16.89 15.45C17.1 14.87 17.1 14.38 17.04 14.27C16.97 14.17 16.81 14.11 16.56 14C16.31 13.86 15.09 13.26 14.87 13.18C14.64 13.1 14.5 13.06 14.31 13.3C14.15 13.55 13.67 14.11 13.53 14.27C13.38 14.44 13.24 14.46 13 14.34C12.74 14.21 11.94 13.95 11 13.11C10.26 12.45 9.77 11.64 9.62 11.39C9.5 11.15 9.61 11 9.73 10.89C9.84 10.78 10 10.6 10.1 10.45C10.23 10.31 10.27 10.2 10.35 10.04C10.43 9.87 10.39 9.73 10.33 9.61C10.27 9.5 9.77 8.26 9.56 7.77C9.36 7.29 9.16 7.35 9 7.34C8.86 7.34 8.7 7.33 8.53 7.33Z"
  ),

  email: path(
    "M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"
  ),

  linkVariant: path(
    "M10.59,13.41C11,13.8 11,14.44 10.59,14.83C10.2,15.22 9.56,15.22 9.17,14.83C7.22,12.88 7.22,9.71 9.17,7.76V7.76L12.71,4.22C14.66,2.27 17.83,2.27 19.78,4.22C21.73,6.17 21.73,9.34 19.78,11.29L18.29,12.78C18.3,11.96 18.17,11.14 17.89,10.36L18.36,9.88C19.54,8.71 19.54,6.81 18.36,5.64C17.19,4.46 15.29,4.46 14.12,5.64L10.59,9.17C9.41,10.34 9.41,12.24 10.59,13.41M13.41,9.17C13.8,8.78 14.44,8.78 14.83,9.17C16.78,11.12 16.78,14.29 14.83,16.24V16.24L11.29,19.78C9.34,21.73 6.17,21.73 4.22,19.78C2.27,17.83 2.27,14.66 4.22,12.71L5.71,11.22C5.7,12.04 5.83,12.86 6.11,13.65L5.64,14.12C4.46,15.29 4.46,17.19 5.64,18.36C6.81,19.54 8.71,19.54 9.88,18.36L13.41,14.83C14.59,13.66 14.59,11.76 13.41,10.59C13,10.2 13,9.56 13.41,9.17Z"
  ),

  previousPage: path(
    "M4,21H19A2,2 0 0,0 21,19V13H17V15L13,12L17,9V11H21V5A2,2 0 0,0 19,3H4A2,2 0 0,0 2,5V19A2,2 0 0,0 4,21M4,15H8V17H4V15M4,11H11V13H4V11M4,7H11V9H4V7M21,11H24V13H21V11Z"
  ),

  nextPage: path(
    "M20,3H5A2,2 0 0,0 3,5V11H7V9L11,12L7,15V13H3V19A2,2 0 0,0 5,21H20A2,2 0 0,0 22,19V5A2,2 0 0,0 20,3M17,17H13V15H17V17M20,13H13V11H20V13M20,9H13V7H20V9M3,13H0V11H3V13Z"
  ),

  alert: path(
    "M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
  ),

  filter: path("M6,13H18V11H6M3,6V8H21V6M10,18H14V16H10V18Z"),

  share: path(
    "M12,1L8,5H11V14H13V5H16M18,23H6C4.89,23 4,22.1 4,21V9A2,2 0 0,1 6,7H9V9H6V21H18V9H15V7H18A2,2 0 0,1 20,9V21A2,2 0 0,1 18,23Z"
  ),

  gridView: path("M3,11H11V3H3M3,21H11V13H3M13,21H21V13H13M13,3V11H21V3"),

  blankCheckbox: path(
    "M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z"
  ),

  imageIcon: path(
    "M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M6,20H15L18,20V12L14,16L12,14L6,20M8,9A2,2 0 0,0 6,11A2,2 0 0,0 8,13A2,2 0 0,0 10,11A2,2 0 0,0 8,9Z"
  ),

  menuLeft: path("M14,7L9,12L14,17V7Z"),

  menuRight: path("M10,17L15,12L10,7V17Z"),
};
