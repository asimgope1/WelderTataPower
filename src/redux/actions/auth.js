import { getObjByKey } from '../../utils/Storage';
import { AUTH_STATUS } from '../types';

export const checkuserToken = () => {
  return async (dispatch) => {
    try {
      const res = await getObjByKey('loginResponse');
      if (res) {
        dispatch({
          type: AUTH_STATUS,
          payload: true,
        });
      } else {
        dispatch({
          type: AUTH_STATUS,
          payload: false,
        });
      }
    } catch (error) {
      console.error('Error retrieving login response:', error);
      dispatch({
        type: AUTH_STATUS,
        payload: false,
      });
    }
  };
};
