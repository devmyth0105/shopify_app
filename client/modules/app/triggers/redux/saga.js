import {fork, call, put, takeLatest, select} from 'redux-saga/effects';
import request from '~/utils/request';
import history from '~/browserHistory';
import * as CONSTANTS from './constants';
import {
  getDragAndDropTagsSuccess,
  getDragAndDropTagsError,
  messageSaveSuccess,
  messageSaveError,
  allTriggerMessagesRequest,
  allTriggerMessagesSuccess,
  allTriggerMessagesError,
  msgLoadSuccess,
  msgLoadError,
  makeSaveNotificaitonStatusRequest,
  makeSaveNotificaitonStatusSuccess,
  makeSaveNotificaitonStatusError,
  deleteMsgSuccess,
  deleteMsgError,
} from './actions';

export function* getDragAndDropTagsRequest() {
  try {
    const data = yield call(request, 'tagservices/alltags', 'GET', null, true, true);
    yield put(getDragAndDropTagsSuccess(data));
  } catch (err) {
    yield push(getDragAndDropTagsError(err));
  }
}

export function* messageSaveRequest(action) {
  let responseData = null;
  let id = action.requestData.msgId;
  let requestData = action.requestData;
  try {
    if (id === 'new') {
      responseData = yield call(request, 'messageservices/create', 'POST', { ...requestData }, true, true);
    } else {
      let messageContent = requestData.msgTemplate;
      responseData = yield call(request, `messageservices/update/id/${id}`, 'PUT', { messageContent }, true, true);
    }
    yield put(allTriggerMessagesRequest());
    yield put(messageSaveSuccess(responseData));
  } catch (err) {
    yield put(messageSaveError(err));
  }
}

export function* allTriggerMessageListRequest() {
  try {
    const data = yield call(request, 'messageservices/all', 'GET', null, true, true);
    yield put(allTriggerMessagesSuccess(data));
  } catch (err) {
    yield put(allTriggerMessagesError(data));
  }
}

export function* messageLoadRequest(action) {
  try {
    const data = yield call(request, `messageservices/messages/${action.id}`, 'GET', null, true, true);
    yield put(msgLoadSuccess(data));
  } catch (err) {
    yield put(msgLoadError(data));
  }
}

export function* makeSaveNotificaitonStatus(action) {
  try {
    const data = yield call(request, `messageservices/msgnotification/id/${action.msgId}`, 'PUT', action, true, true );
    yield put(makeSaveNotificaitonStatusSuccess(data));
  } catch (err) {
    yield put(makeSaveNotificaitonStatusError(err));
  }
}

export function* deleteMessageReqeust(action) {
  try {
    const data = yield call(request, `messageservices/deletemsg/id/${action.msgId}`, 'DELETE', null, true, true);
    yield put(allTriggerMessagesRequest());
    yield put(deleteMsgSuccess(data));
  } catch (err) {
    yield put(deleteMsgError(err));
  }
}

export default [
  fork(takeLatest, CONSTANTS.DRAG_DROP_TAGS_LIST_REQUEST, getDragAndDropTagsRequest),
  fork(takeLatest, CONSTANTS.TRIGGER_MESSAGE_SAVE_REQUEST, messageSaveRequest),
  fork(takeLatest, CONSTANTS.TRIGGER_ALL_MESSAGE_REQUEST, allTriggerMessageListRequest),
  fork(takeLatest, CONSTANTS.MESSAGE_LOAD_REQUEST, messageLoadRequest),
  fork(takeLatest, CONSTANTS.MESSAGE_NOTIFICATION_STATUS_REQUEST, makeSaveNotificaitonStatus),
  fork(takeLatest, CONSTANTS.MESSAGE_DELETE_REQUEST, deleteMessageReqeust),
];
