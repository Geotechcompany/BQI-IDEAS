import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar'
import { ThumbsUp, MessageCircle } from 'lucide-react'

// This would typically come from a database
const ideas = [
  {
    id: 1,
    title: 'AI-powered content creation',
    description: 'Leverage AI to generate high-quality content for marketing campaigns. This innovative approach can significantly reduce the time and resources required for content creation while ensuring consistent quality and relevance. By utilizing machine learning algorithms, we can analyze trends, user preferences, and engagement metrics to produce tailored content that resonates with our target audience. This not only streamlines our marketing efforts but also allows for more personalized and effective communication with our customers.',
    category: 'Marketing',
    likes: 24,
    comments: 8,
    author: {
      name: 'Alice Johnson',
      avatar: '/placeholder.svg?height=32&width=32'
    }
  },
  // ... other ideas
]

export default function IdeaPage({ params }: { params: { id: string } }) {
  const idea = ideas.find(i => i.id === parseInt(params.id))

  if (!idea) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{idea.title}</CardTitle>
          <CardDescription>
            <Badge variant="secondary">{idea.category}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{idea.description}</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="flex space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <ThumbsUp className="w-4 h-4 mr-1" />
              {idea.likes}
            </span>
            <span className="flex items-center">
              <MessageCircle className="w-4 h-4 mr-1" />
              {idea.comments}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={idea.author.avatar} alt={idea.author.name} />
              <AvatarFallback>{idea.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-500">{idea.author.name}</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

