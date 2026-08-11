import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getArticleById } from '../../features/public/services/public.service';
import { Button, Skeleton } from '@heroui/react';

export const Route = createFileRoute('/article/$articleId')({
  component: ArticleDetailComponent,
});

function ArticleDetailComponent() {
  const { articleId } = Route.useParams();

  const { data: article, isLoading, isError, refetch } = useQuery({
    queryKey: ['public-article', articleId],
    queryFn: () => getArticleById(articleId),
  });

  if (isLoading) {
    return (
      <article className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Skeleton className="w-32 h-10 rounded-lg mb-8" />
          <Skeleton className="w-1/3 h-4 rounded-full mb-6" />
          <Skeleton className="w-full h-16 rounded-lg mb-8" />
          <Skeleton className="w-3/4 h-16 rounded-lg mb-8" />
        </div>
        <Skeleton className="w-full h-[400px] rounded-2xl mb-12" />
        <div className="space-y-4">
          <Skeleton className="w-full h-4 rounded-full" />
          <Skeleton className="w-full h-4 rounded-full" />
          <Skeleton className="w-5/6 h-4 rounded-full" />
          <Skeleton className="w-full h-4 rounded-full" />
          <Skeleton className="w-4/5 h-4 rounded-full" />
        </div>
      </article>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <div className="bg-danger-50 text-danger p-8 rounded-3xl max-w-lg">
          <h2 className="text-2xl font-bold mb-4">Error de conexión</h2>
          <p className="mb-6">No pudimos cargar este artículo. Verifica tu conexión a internet o intenta nuevamente.</p>
          <div className="flex justify-center gap-4">
            <Button as={Link} to="/" variant="bordered" color="danger">Volver al inicio</Button>
            <Button color="danger" variant="flat" onPress={() => refetch()}>Reintentar</Button>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-4">👻</div>
        <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Artículo no encontrado</h2>
        <p className="text-gray-500 mb-8">El artículo que intentas leer no existe o fue eliminado.</p>
        <Button as={Link} to="/" color="primary" variant="flat">
          Volver al feed
        </Button>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-8">
        <Button 
          as={Link} 
          to="/" 
          variant="light" 
          color="primary"
          className="mb-8 font-medium"
        >
          &larr; Volver al feed
        </Button>

        <div className="flex items-center gap-2 text-sm font-sans uppercase tracking-widest text-primary font-bold mb-6">
          <span>{article.authorName}</span>
          <span>&mdash;</span>
          <span className="text-gray-400">
            {new Date(article.createdAt).toLocaleDateString('es-ES', { 
              year: 'numeric', month: 'long', day: 'numeric' 
            })}
          </span>
        </div>

        <h1 className="text-5xl md:text-6xl font-serif font-black mb-8 leading-tight text-foreground">
          {article.title}
        </h1>
      </div>

      {article.coverImageUrl && (
        <figure className="mb-12">
          <img 
            src={article.coverImageUrl} 
            alt={article.title} 
            className="w-full rounded-2xl shadow-sm object-cover max-h-[600px]"
          />
        </figure>
      )}

      <div className="prose prose-lg prose-serif max-w-none">
        <p className="text-gray-800 font-serif text-xl leading-loose whitespace-pre-wrap">
          {article.content}
        </p>
      </div>
    </article>
  );
}
