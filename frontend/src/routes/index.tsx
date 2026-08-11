import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getAuthors, getPublicArticles } from '@/features/public/services/public.service';
import { Input, Card, CardBody, Pagination, Skeleton, Button } from '@heroui/react';
import { useState, useEffect } from 'react';

type SearchParams = {
  search?: string;
  page?: number;
};

export const Route = createFileRoute('/')({
  component: HomePage,
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    const s = (search.search as string) || '';
    const p = Number(search.page) || 1;
    return {
      search: s === '' ? undefined : s,
      page: p === 1 ? undefined : p,
    };
  }
});

function HomePage() {
  const { search = '', page = 1 } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== search) {
        navigate({ search: (prev) => ({ ...prev, search: localSearch, page: 1 }), replace: true });
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [localSearch, search, navigate]);

  const setPage = (newPage: number) => navigate({ search: (prev) => ({ ...prev, page: newPage }), replace: true });

  const { data: authors, isLoading: isLoadingAuthors, isError: isErrorAuthors, refetch: refetchAuthors } = useQuery({
    queryKey: ['authors'],
    queryFn: () => getAuthors(),
    staleTime: 1000 * 60 * 5,
  });

  const { data: articlesResult, isFetching, isError: isErrorArticles, refetch: refetchArticles } = useQuery({
    queryKey: ['public-articles', search, page],
    queryFn: () => getPublicArticles(search, page),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  let articles = articlesResult?.data || [];

  if (localSearch) {
    const lowerSearch = localSearch.toLowerCase();
    articles = articles.filter(article => 
      article.title.toLowerCase().includes(lowerSearch) ||
      article.content.toLowerCase().includes(lowerSearch) ||
      article.authorName.toLowerCase().includes(lowerSearch)
    );
  }

  const totalPages = Math.ceil((articlesResult?.total || 0) / 5) || 1;

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16">
      
      <div>
        <h2 className="text-4xl font-serif font-black mb-8">Últimas Publicaciones</h2>

        {isErrorArticles ? (
          <div className="text-center bg-danger-50 text-danger p-8 rounded-2xl max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-2">No pudimos cargar los artículos</h3>
            <p className="mb-4">Ocurrió un problema de conexión al intentar obtener los datos.</p>
            <Button color="danger" variant="flat" onPress={() => refetchArticles()}>Reintentar</Button>
          </div>
        ) : isFetching ? (
          <div className="grid gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} shadow="none" className="border-b border-gray-200 rounded-none bg-transparent mb-8 pb-8">
                <CardBody className="p-0 flex flex-col md:flex-row gap-8">
                  <Skeleton className="w-full md:w-64 h-48 md:h-64 rounded-xl" />
                  <div className="flex-grow flex flex-col justify-center space-y-4">
                    <Skeleton className="w-1/4 h-4 rounded-full" />
                    <Skeleton className="w-3/4 h-10 rounded-lg" />
                    <Skeleton className="w-full h-4 rounded-full" />
                    <Skeleton className="w-full h-4 rounded-full" />
                    <Skeleton className="w-2/3 h-4 rounded-full" />
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {articles.length === 0 ? (
              <div className="text-center bg-gray-50 p-12 rounded-3xl max-w-2xl mx-auto mt-8">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-2xl font-bold mb-2 text-foreground">No hay resultados</h3>
                <p className="text-gray-500 mb-6">No pudimos encontrar ningún artículo que coincida con "{localSearch}".</p>
                <Button color="primary" variant="flat" onPress={() => setLocalSearch('')}>
                  Limpiar búsqueda
                </Button>
              </div>
            ) : (
          <div className="grid gap-6">
            {articles.map((article) => (
              <Card key={article.id} shadow="none" className="border-b border-gray-200 rounded-none bg-transparent mb-8 pb-8">
                <CardBody className="p-0">
                  <div className="flex flex-col md:flex-row gap-8">
                    {article.coverImageUrl && (
                      <div className="flex-shrink-0 w-full md:w-64">
                        <Link to="/article/$articleId" params={{ articleId: article.id }}>
                          <img src={article.coverImageUrl} alt={article.title} className="w-full h-48 md:h-64 object-cover rounded-xl shadow-sm hover:opacity-90 transition-opacity" />
                        </Link>
                      </div>
                    )}
                    <div className="flex-grow flex flex-col justify-center">
                      <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-wider text-primary font-bold mb-3">
                        <span>Por: <button onClick={() => { setLocalSearch(article.authorName); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:underline cursor-pointer focus:outline-none">{article.authorName}</button></span>
                        <span>&mdash;</span>
                        <span className="text-gray-400">{new Date(article.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <Link to="/article/$articleId" params={{ articleId: article.id }}>
                        <h3 className="text-3xl md:text-4xl font-serif font-black mb-4 leading-tight text-foreground hover:text-primary transition-colors">{article.title}</h3>
                      </Link>
                      <p className="text-gray-600 font-serif text-lg leading-relaxed whitespace-pre-wrap line-clamp-3">{article.content}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
            )}
          </>
        )}
        
        {articlesResult && totalPages > 1 && (
          <div className="flex justify-center mt-10">
            <Pagination
              total={totalPages}
              page={page}
              onChange={setPage}
              showControls
            />
          </div>
        )}
      </div>

      {/* BARRA LATERAL: BUSCADOR Y AUTORES */}
      <aside className="lg:w-1/3 xl:w-1/4">
        <div className="sticky top-8 space-y-12">
          
          {/* Buscador */}
          <div>
            <h3 className="font-serif font-bold text-2xl mb-4 text-foreground">Buscador</h3>
            <Input
              size="lg"
              placeholder="Buscar por palabra clave..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              isClearable
              onClear={() => setLocalSearch('')}
              className="w-full"
            />
          </div>

          {/* Autores */}
          <div>
            <h3 className="font-serif font-bold text-2xl mb-4 text-foreground">Top Autores</h3>
            
            {isErrorAuthors ? (
              <div className="text-center bg-danger-50 text-danger p-4 rounded-xl">
                <p className="mb-2 text-sm font-bold">Error de red.</p>
                <Button color="danger" variant="flat" size="sm" onPress={() => refetchAuthors()}>Reintentar</Button>
              </div>
            ) : isLoadingAuthors ? (
              <div className="flex flex-col gap-3">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} shadow="sm" className="bg-secondary/5 border-none">
                    <CardBody className="p-3 flex flex-row items-center gap-4">
                      <div className="flex-1 space-y-2">
                        <Skeleton className="w-3/4 h-4 rounded-md" />
                        <Skeleton className="w-1/2 h-3 rounded-full" />
                      </div>
                      <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                    </CardBody>
                  </Card>
                ))}
              </div>
            ) : authors?.length === 0 ? (
              <p className="text-gray-500 text-sm">No hay autores.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {authors?.map((author) => (
                  <Card key={author.id} shadow="sm" className="hover:shadow-md transition-shadow bg-secondary/10 border-none cursor-pointer" isPressable onPress={() => { setLocalSearch(author.name); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                    <CardBody className="p-4 flex flex-row items-center justify-between gap-4">
                      <div className="flex-1 text-left">
                        <h4 className="font-serif font-bold text-primary leading-tight break-words">{author.name}</h4>
                      </div>
                      <div className="flex items-center gap-2 bg-white rounded-full px-4 py-1.5 shadow-sm border border-secondary/10 shrink-0">
                        <span className="font-black text-primary text-lg leading-none">{author.articles.length}</span>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Publicaciones</span>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>

    </div>
  );
}
