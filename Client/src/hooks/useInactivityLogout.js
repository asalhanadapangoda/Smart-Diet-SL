import { useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds

const ACTIVITY_EVENTS = [
  'mousedown',
  'mousemove',
  'keydown',
  'scroll',
  'touchstart',
  'click',
];

const DEFAULT_MESSAGE = 'You have been logged out due to inactivity. Please sign in again.';

/**
 * Hook that automatically logs out the user after 15 minutes of inactivity.
 * Tracks user activity (mouse, keyboard, touch, scroll) and resets the timer on any activity.
 * @param {boolean} isActive - Whether the inactivity timer should be active (e.g. when user is logged in)
 * @param {string} [message] - Optional custom message to show when auto-logout occurs
 */
export function useInactivityLogout(isActive, message = DEFAULT_MESSAGE) {
  const dispatch = useDispatch();
  const timeoutRef = useRef(null);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    toast.error(message);
  }, [dispatch, message]);

  const resetTimer = useCallback(() => {
    if (!isActive) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      handleLogout();
    }, INACTIVITY_TIMEOUT);
  }, [isActive, handleLogout]);

  useEffect(() => {
    if (!isActive) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    // Set up activity listeners
    const handleActivity = () => {
      resetTimer();
    };

    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // Start the initial timer
    resetTimer();

    // Cleanup
    return () => {
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isActive, resetTimer]);
}
