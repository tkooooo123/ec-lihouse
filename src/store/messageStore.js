import { createContext } from "react";

export const MessageContext = createContext({})

export const initState = {
    type: '',
    title: '',
    text: '',
}

export const messageReducer = (state, action) => {
    switch (action.type) {
        case "POST_MESSAGE":
            return {
                ...action.payload
            }

        case "CLEAR_MESSAGE":
            return {
                ...initState,
            }

        case "DELETE_MESSAGE":
            return {
                ...action.payload
            }

        default:
            return state;
            
    }
}

export function handleSuccessMessage(dispatch, res) {
    dispatch({
        type: 'POST_MESSAGE',
        payload: {
            type: 'success',
            title: '更新成功',
            text: res.data.message
        }
    });
    setTimeout(() => {
        dispatch({
            type: 'CLEAR_MESSAGE'
        })
    }, 3000)   
}

export function handleErrorMessage(dispatch, error) {
    dispatch({
        type: 'POST_MESSAGE',
        payload: {
            type: 'danger',
            title: '失敗',
            text: Array.isArray(error?.response?.data?.message)
                ? error?.response?.data?.message.join('、')
                : error?.response?.data?.message
        }
    });
    setTimeout(() => {
        dispatch({
            type: 'CLEAR_MESSAGE'
        })
    }, 3000)   
}

export function handleSubscribeMessage(dispatch) {
    dispatch({
        type: 'POST_MESSAGE',
        payload: {
            type: 'success',
            title: '訂閱成功',
            text: '感謝您的訂閱！'
        }
    });
    setTimeout(() => {
        dispatch({
            type: 'CLEAR_MESSAGE'
        })
    }, 3000)   
}

export function handleUpdateMessage(dispatch, res) {
    dispatch({
        type: 'POST_MESSAGE',
        payload: {
            type: 'danger',
            title: '更新失敗',
            text: res.data.message
        }
    });
    setTimeout(() => {
        dispatch({
            type: 'CLEAR_MESSAGE'
        })
    }, 3000)   
}