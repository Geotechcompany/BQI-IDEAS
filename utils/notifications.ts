export async function createNotification({
  type,
  userId,
  ideaId,
  actorId,
  message
}: {
  type: 'idea_posted' | 'idea_liked' | 'idea_commented' | 'idea_implemented'
  userId: string
  ideaId: number
  actorId: string
  message: string
}) {
  try {
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        user_id: userId,
        idea_id: ideaId,
        actor_id: actorId,
        message
      })
    })
  } catch (error) {
    console.error('Failed to create notification:', error)
  }
}
