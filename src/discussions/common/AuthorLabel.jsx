import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

import { Icon, OverlayTrigger, Tooltip } from '@openedx/paragon';
import { Institution, Person, School } from '@openedx/paragon/icons';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { generatePath, Link } from 'react-router-dom';
import * as timeago from 'timeago.js';

import { useIntl } from '@edx/frontend-platform/i18n';

import { FbrRoleColors, FbrRoleLabels, Routes } from '../../data/constants';
import messages from '../messages';
import { selectFbrUserRole } from '../posts/data/selectors';
import { getAuthorLabel } from '../utils';
import DiscussionContext from './context';
import timeLocale from './time-locale';

const FBR_ROLE_ICONS = {
  super_admin: Institution,
  middle_admin: Institution,
  data_admin: Institution,
  instructor: School,
  trainee: Person,
};

const AuthorLabel = ({
  author,
  authorLabel,
  linkToProfile,
  labelColor,
  alert,
  postCreatedAt,
  authorToolTip,
  postOrComment,
}) => {
  timeago.register('time-locale', timeLocale);
  const intl = useIntl();
  const { courseId, enableInContextSidebar } = useContext(DiscussionContext);
  const { icon: courseRoleIcon, authorLabelMessage: courseRoleMessage } = useMemo(
    () => getAuthorLabel(intl, authorLabel),
    [authorLabel],
  );
  const fbrRole = useSelector(selectFbrUserRole(author));

  const effectiveIcon = fbrRole ? FBR_ROLE_ICONS[fbrRole] : courseRoleIcon;
  const effectiveMessage = fbrRole ? FbrRoleLabels[fbrRole] : courseRoleMessage;
  const effectiveColor = fbrRole ? `text-${FbrRoleColors[fbrRole]}` : labelColor;

  const isRetiredUser = author ? author.startsWith('retired__user') : false;
  const showTextPrimary = !effectiveMessage && !isRetiredUser && !alert;
  const className = classNames('d-flex align-items-center', { 'mb-0.5': !postOrComment }, effectiveColor);

  const showUserNameAsLink = linkToProfile && author && author !== intl.formatMessage(messages.anonymous)
                             && !enableInContextSidebar;

  const authorName = useMemo(() => (
    <span
      className={classNames('mr-1.5 font-style font-weight-500 author-name', {
        'text-gray-700': isRetiredUser,
        'text-primary-500': !effectiveMessage && !isRetiredUser,
      })}
      role="heading"
      aria-level="2"
    >
      {isRetiredUser ? '[Deactivated]' : author}
    </span>
  ), [author, effectiveMessage, isRetiredUser]);

  const labelContents = useMemo(() => (
    <>
      {(fbrRole || effectiveIcon) && (
        <OverlayTrigger
          placement={authorToolTip ? 'top' : 'right'}
          overlay={(
            <Tooltip id={authorToolTip ? `endorsed-by-${author}-tooltip` : `${authorLabel}-label-tooltip`}>
              <>
                {authorToolTip ? author : (effectiveMessage || authorLabel)}
                <br />
                {intl.formatMessage(messages.authorAdminDescription)}
              </>
            </Tooltip>
          )}
          trigger={['hover', 'focus']}
        >
          <div className={classNames('d-flex flex-row align-items-center')}>
            <Icon
              style={{
                width: '1rem',
                height: '1rem',
              }}
              src={effectiveIcon}
              data-testid="author-icon"
            />
            {effectiveMessage && (
              <span
                className={classNames('mr-1.5 font-style font-weight-500', {
                  'text-primary-500': showTextPrimary,
                  'text-gray-700': isRetiredUser,
                })}
                style={{ marginLeft: '2px' }}
              >
                {effectiveMessage}
              </span>
            )}
          </div>
        </OverlayTrigger>
      )}
      {postCreatedAt && (
        <span
          title={postCreatedAt}
          className={classNames('align-content-center post-summary-timestamp', {
            'text-white': alert,
            'text-gray-500': !alert,
          })}
          style={{ lineHeight: '20px', fontSize: '12px', marginBottom: '-2.3px' }}
        >
          {timeago.format(postCreatedAt, 'time-locale')}
        </span>
      )}
    </>
  ), [
    author, effectiveIcon, effectiveMessage, authorToolTip, fbrRole,
    isRetiredUser, postCreatedAt, showTextPrimary, alert, authorLabel,
  ]);

  const learnerPostsLink = useMemo(() => {
    if (!showUserNameAsLink) {
      return null;
    }
    return (
      <Link
        data-testid="learner-posts-link"
        id="learner-posts-link"
        to={generatePath(Routes.LEARNERS.POSTS, { learnerUsername: author, courseId })}
        className="text-decoration-none text-reset"
        style={{ width: 'fit-content' }}
      >
        {!alert && authorName}
      </Link>
    );
  }, [showUserNameAsLink, author, courseId, alert, authorName]);

  return showUserNameAsLink
    ? (
      <div className={`${className} flex-wrap`}>
        {!authorLabel ? (
          <OverlayTrigger
            placement={authorToolTip ? 'top' : 'right'}
            overlay={(
              <Tooltip id={authorToolTip ? `endorsed-by-${author}-tooltip` : `${authorLabel}-label-tooltip`}>
                <>
                  {intl.formatMessage(messages.authorLearnerTitle)}
                  <br />
                  {intl.formatMessage(messages.authorLearnerDescription)}
                </>
              </Tooltip>
        )}
            trigger={['hover', 'focus']}
          >
            {learnerPostsLink}
          </OverlayTrigger>
        ) : learnerPostsLink }
        {labelContents}
      </div>
    )
    : <div className={`${className} flex-wrap`}>{authorName}{labelContents}</div>;
};

AuthorLabel.propTypes = {
  author: PropTypes.string.isRequired,
  authorLabel: PropTypes.string,
  linkToProfile: PropTypes.bool,
  labelColor: PropTypes.string,
  alert: PropTypes.bool,
  postCreatedAt: PropTypes.string,
  authorToolTip: PropTypes.bool,
  postOrComment: PropTypes.bool,
};

AuthorLabel.defaultProps = {
  linkToProfile: false,
  authorLabel: null,
  labelColor: '',
  alert: false,
  postCreatedAt: null,
  authorToolTip: false,
  postOrComment: false,
};

export default React.memo(AuthorLabel);
