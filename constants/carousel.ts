export interface CarouselSlide {
  title: string;
  description: string;
  lottieAnimation: string;
  isActive: boolean;
}

export const CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    title: "Just Do It",
    description: "Join millions of athletes and fitness enthusiasts who trust CODALWARE for their performance needs. Experience the perfect blend of innovation and excellence.",
    lottieAnimation: "/animations/fitness.json",
    isActive: true
  },
  {
    title: "Unleash Your Potential",
    description: "Discover cutting-edge gear designed to push your limits and elevate your performance to new heights. Every step forward is a victory.",
    lottieAnimation: "/animations/performance.json",
    isActive: false
  },
  {
    title: "Innovation Meets Performance",
    description: "Experience the perfect blend of technology and style with CODALWARE's premium athletic collection. Redefine what's possible.",
    lottieAnimation: "/animations/innovation.json",
    isActive: false
  }
];

export const CAROUSEL_CONFIG = {
  slideInterval: 7000, // Change slide every 7 seconds (more time to appreciate animations)
  animationDuration: 800, // Smoother transition duration
  lottieSpeed: 0.8, // Slightly slower for more graceful animations
  enableHoverPause: true, // Pause animation on hover
  glowIntensity: 0.6, // Glow effect intensity
  scaleOnHover: 1.05, // Scale factor on hover
  transitionEasing: 'cubic-bezier(0.4, 0, 0.2, 1)', // Smooth easing function
} as const;
