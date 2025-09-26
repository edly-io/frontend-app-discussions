import { PluginSlot } from '@openedx/frontend-plugin-framework/dist';

export const UserMentionPluginSlot = ({ text }) => (
  <PluginSlot
    id="org.openedx.frontend.discussions.user_mention_plugin.v1"
    idAliases={['user_mention_plugin']}
    pluginProps={{
      text,
    }}
  />
);