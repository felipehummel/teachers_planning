export async function fetchStreamedPlan(userMessage: string, onComplete: () => void, onUpdate: (resultUntilNow: string) => void) {
  try {
    const response = await fetch('/api/planner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!response.ok) throw new Error(`API response error: ${response.statusText}`);

    const reader = response.body?.getReader();
    if (!reader) throw new Error('Could not read response stream');

    let assistantMessage = '';
    onUpdate('');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = new TextDecoder().decode(value);
      assistantMessage += text;
      onUpdate(assistantMessage);
    }
  } catch (error) {
    console.error('Error sending message:', error);
    onUpdate('Sorry, there was an error processing your request.');
  } finally {
    onComplete();
  }
}