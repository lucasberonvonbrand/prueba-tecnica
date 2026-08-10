import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getAuthors, getPublicArticles } from '@/features/public/services/public.service';
import { Input, Card, CardBody, CardHeader, Divider, Pagination } from '@heroui/react';

type SearchParams = {
  search?: string;
  page?: number;
};

export const Route = createFileRoute('/')({
  component: HomePage,
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      search: (search.search as string) || '',
      page: Number(search.page) || 1,
    };
  }
});

function HomePage() {
  const { search = '', page = 1 } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const setSearch = (newSearch: string) => navigate({ search: (prev) => ({ ...prev, search: newSearch, page: 1 }) });
  const setPage = (newPage: number) => navigate({ search: (prev) => ({ ...prev, page: newPage }) });

  const { data: authors, isLoading: isLoadingAuthors } = useQuery({
    queryKey: ['authors'],
    queryFn: () => getAuthors(),
  });

  const { data: articlesResult, isLoading: isLoadingArticles } = useQuery({
    queryKey: ['public-articles', search, page],
    queryFn: () => getPublicArticles(search, page),
  });

  const articles = articlesResult?.data || [];
  const totalPages = Math.ceil((articlesResult?.total || 0) / 10) || 1;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-16">
      
      {/* SECCIÓN AUTORES */}
      <section>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold mb-4">Nuestros Autores</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Conoce a los creadores de contenido de nuestra plataforma.
          </p>
        </div>

        {isLoadingAuthors ? (
          <div className="text-center text-gray-500">Cargando autores...</div>
        ) : authors?.length === 0 ? (
          <div className="text-center text-gray-500">No hay autores registrados.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authors?.map((author) => (
              <Card key={author.id} className="hover:shadow-md transition-shadow bg-blue-50/30">
                <CardHeader className="flex flex-col items-center p-6">
                  <h3 className="text-xl font-bold text-blue-900">{author.name}</h3>
                  <p className="text-sm text-blue-600/70">{author.email}</p>
                </CardHeader>
                <Divider />
                <CardBody className="p-6 text-center">
                  <div className="text-4xl font-black text-blue-600 mb-2">{author.articles.length}</div>
                  <div className="text-sm font-medium text-gray-600">Artículos publicados</div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Divider />

      {/* SECCIÓN BUSCADOR DE ARTÍCULOS */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold mb-4">Buscador de Artículos</h2>
          <Input
            size="lg"
            placeholder="Buscar por título, contenido o autor..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="max-w-2xl mx-auto"
            isClearable
            onClear={() => { setSearch(''); setPage(1); }}
          />
        </div>

        {isLoadingArticles ? (
          <div className="text-center text-gray-500 mt-10">Buscando artículos...</div>
        ) : articles.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">No se encontraron artículos para tu búsqueda.</div>
        ) : (
          <div className="grid gap-6">
            {articles.map((article) => (
              <Card key={article.id}>
                <CardBody className="p-6">
                  <div className="flex gap-6">
                    {article.coverImageUrl && (
                      <div className="flex-shrink-0">
                        <img src={article.coverImageUrl} alt={article.title} className="w-32 h-32 object-cover rounded-lg shadow-sm" />
                      </div>
                    )}
                    <div className="flex-grow">
                      <h3 className="text-2xl font-bold mb-2">{article.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span className="font-medium text-primary">Por: {article.authorName}</span>
                        <span>•</span>
                        <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap line-clamp-3">{article.content}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
        
        {!isLoadingArticles && totalPages > 1 && (
          <div className="flex justify-center mt-10">
            <Pagination
              total={totalPages}
              page={page}
              onChange={setPage}
              showControls
            />
          </div>
        )}
      </section>

    </div>
  );
}
