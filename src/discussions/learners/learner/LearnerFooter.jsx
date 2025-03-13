import React from 'react';
import PropTypes from 'prop-types';

import { Icon, OverlayTrigger, Tooltip } from '@openedx/paragon';
import {
  Edit, QuestionAnswerOutline, Report, ReportGmailerrorred,
} from '@openedx/paragon/icons';
import { useSelector } from 'react-redux';

import { useIntl } from '@edx/frontend-platform/i18n';

import { selectUserHasModerationPrivileges, selectUserIsGroupTa } from '../../data/selectors';
import messages from '../messages';

const LearnerFooter = ({
  inactiveFlags, activeFlags, threads, responses, replies, username,
}) => {
  const intl = useIntl();
  const userHasModerationPrivileges = useSelector(selectUserHasModerationPrivileges);
  const userIsGroupTa = useSelector(selectUserIsGroupTa);
  const canSeeLearnerReportedStats = (activeFlags || inactiveFlags) && (userHasModerationPrivileges || userIsGroupTa);

  return (
    <div className="d-flex align-items-center pt-1 mt-2.5" style={{ marginBottom: '2px' }}>
      <OverlayTrigger
        placement="right"
        id={`learner-${username}-responses`}
        overlay={(
          <Tooltip id={`learner-${username}-responses`}>
            <div className="d-flex flex-column align-items-start">
              {intl.formatMessage(messages.allActivity)}
            </div>
          </Tooltip>
        )}
      >
        <div className="d-flex align-items-center">
        <svg width="24" className='pgn__icon icon-size mr-2' height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8.35402 19.7002L9.45339 20.7996C9.89995 21.2461 10.6238 21.2461 11.0704 20.7996L12.1697 19.7002C12.483 19.3869 12.9072 19.2118 13.3499 19.2118H14.1768C15.859 19.2118 17.223 17.8478 17.223 16.1647V10.8157C17.223 9.13354 15.859 7.76953 14.1768 7.76953H6.3479C4.66479 7.76953 3.30078 9.13354 3.30078 10.8157V16.1647C3.30078 17.8478 4.66479 19.2118 6.3479 19.2118H7.17389C7.61656 19.2118 8.04074 19.3869 8.35402 19.7002Z" stroke="#111827" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7.37891 7.76979V6.99147C7.37891 5.3103 8.74096 3.94922 10.4289 3.94922H18.2579C19.939 3.94922 21.3011 5.3103 21.3011 6.99147V12.3414C21.3011 14.0294 19.939 15.3905 18.2579 15.3905H17.4319C17.3618 15.3905 17.2927 15.3983 17.2227 15.4051" stroke="#111827" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12.4541 13.6211V13.6909M12.737 13.6361C12.737 13.7932 12.6095 13.9206 12.4524 13.9206C12.2953 13.9206 12.168 13.7932 12.168 13.6361C12.168 13.4789 12.2953 13.3516 12.4524 13.3516C12.6095 13.3516 12.737 13.4789 12.737 13.6361Z" stroke="#111827" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7.76858 13.6211V13.6909M8.05144 13.6361C8.05144 13.7932 7.92397 13.9206 7.76685 13.9206C7.60972 13.9206 7.48242 13.7932 7.48242 13.6361C7.48242 13.4789 7.60972 13.3516 7.76685 13.3516C7.92397 13.3516 8.05144 13.4789 8.05144 13.6361Z" stroke="#111827" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

          {threads + responses + replies}
        </div>
      </OverlayTrigger>
      <OverlayTrigger
        placement="right"
        id={`learner-${username}-posts`}
        overlay={(
          <Tooltip id={`learner-${username}-posts`}>
            <div className="d-flex flex-column align-items-start">
              {intl.formatMessage(messages.posts)}
            </div>
          </Tooltip>
        )}
      >
        <div className="d-flex align-items-center">
          <Icon src={Edit} className="icon-size mr-2 ml-4" />
          {threads}
        </div>
      </OverlayTrigger>
      {Boolean(canSeeLearnerReportedStats) && (
        <OverlayTrigger
          placement="right"
          id={`learner-${username}-flags`}
          overlay={(
            <Tooltip id={`learner-${username}-flags`}>
              <div className="d-flex flex-column align-items-start">
                {Boolean(activeFlags)
                  && (
                  <span>
                    {intl.formatMessage(messages.reported, { reported: activeFlags })}
                  </span>
                  )}
                {Boolean(inactiveFlags)
                      && (
                        <span>
                          {intl.formatMessage(messages.previouslyReported, { previouslyReported: inactiveFlags })}
                        </span>
                      )}
              </div>
            </Tooltip>
          )}
        >
          <div className="d-flex align-items-center">
            <Icon src={activeFlags ? Report : ReportGmailerrorred} className="icon-size mr-2 ml-4 text-danger" />
            {activeFlags} {Boolean(inactiveFlags) && `/ ${inactiveFlags}`}
          </div>
        </OverlayTrigger>
      )}
    </div>
  );
};

LearnerFooter.propTypes = {
  inactiveFlags: PropTypes.number,
  activeFlags: PropTypes.number,
  threads: PropTypes.number,
  responses: PropTypes.number,
  replies: PropTypes.number,
  username: PropTypes.string,
};

LearnerFooter.defaultProps = {
  inactiveFlags: 0,
  activeFlags: 0,
  threads: 0,
  responses: 0,
  replies: 0,
  username: '',
};

export default React.memo(LearnerFooter);
