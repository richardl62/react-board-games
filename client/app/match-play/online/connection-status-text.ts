import { ConnectionStatus, describeClose } from './use-server-connection';

export function connectionStatusText(connectionStatus: ConnectionStatus): string {
  if (connectionStatus === 'connected') {
    return 'connected';
  }

  if (connectionStatus === 'connecting') {
    return 'connecting ...';
  }

  let message = `connection closed (${describeClose(connectionStatus.closeEvent)})`;

  if (connectionStatus.reconnecting) {
    message += ': attempting to reconnect...';
  }

  return message;
}
