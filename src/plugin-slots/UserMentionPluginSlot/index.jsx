import { PluginSlot } from '@openedx/frontend-plugin-framework/dist';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

export const UserMentionPluginSlot = ({ editor }) => (
  <PluginSlot
    id="org.openedx.frontend.discussions.user_mention_plugin.v1"
    idAliases={['user_mention_plugin']}
    pluginProps={{
      editor,
      authClient: getAuthenticatedHttpClient,
      getConfig,
    }}
  />
);
