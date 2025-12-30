<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index()
    {
        $blogPosts = BlogPost::where('status', 'published')
            ->where('publish_date', '<=', now())
            ->orderBy('updated_at', 'desc')
            ->get();

        $sitemap = '<?xml version="1.0" encoding="UTF-8"?>';
        $sitemap .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
        
        // Homepage
        $sitemap .= '<url>';
        $sitemap .= '<loc>' . url('/') . '</loc>';
        $sitemap .= '<lastmod>' . now()->toAtomString() . '</lastmod>';
        $sitemap .= '<changefreq>daily</changefreq>';
        $sitemap .= '<priority>1.0</priority>';
        $sitemap .= '</url>';
        
        // Static pages
        $staticPages = [
            ['url' => '/about', 'priority' => '0.8'],
            ['url' => '/contact', 'priority' => '0.8'],
            ['url' => '/blog', 'priority' => '0.9'],
            ['url' => '/government-orders', 'priority' => '0.7'],
            ['url' => '/academic-calendar', 'priority' => '0.7'],
            ['url' => '/important-links', 'priority' => '0.7'],
            ['url' => '/privacy-policy', 'priority' => '0.5'],
        ];
        
        foreach ($staticPages as $page) {
            $sitemap .= '<url>';
            $sitemap .= '<loc>' . url($page['url']) . '</loc>';
            $sitemap .= '<lastmod>' . now()->toAtomString() . '</lastmod>';
            $sitemap .= '<changefreq>weekly</changefreq>';
            $sitemap .= '<priority>' . $page['priority'] . '</priority>';
            $sitemap .= '</url>';
        }
        
        // Blog posts
        foreach ($blogPosts as $post) {
            $sitemap .= '<url>';
            $sitemap .= '<loc>' . url('/blog/' . $post->slug) . '</loc>';
            $sitemap .= '<lastmod>' . $post->updated_at->toAtomString() . '</lastmod>';
            $sitemap .= '<changefreq>monthly</changefreq>';
            $sitemap .= '<priority>0.6</priority>';
            $sitemap .= '</url>';
        }
        
        $sitemap .= '</urlset>';
        
        return response($sitemap, 200)
            ->header('Content-Type', 'text/xml');
    }
}
