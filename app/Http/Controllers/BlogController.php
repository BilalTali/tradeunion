<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class BlogController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of blog posts (admin view).
     */
    public function index(Request $request)
    {
        $query = BlogPost::with('author')->latest();

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by category
        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        $posts = $query->paginate(15);

        return Inertia::render('Blog/Index', [
            'posts' => $posts,
            'filters' => [
                'status' => $request->status ?? 'all',
                'category' => $request->category ?? 'all',
            ],
        ]);
    }

    /**
     * Show the form for creating a new blog post.
     */
    public function create(Request $request)
    {
        return Inertia::render('Blog/Create', [
            'categories' => ['circular', 'statement', 'notice', 'article', 'event', 'announcement'],
            'initialCategory' => $request->query('category'),
            'portfolios' => $this->getAllowedPortfolios(),
        ]);
    }

    /**
     * Get allowed portfolios based on user role.
     */
    private function getAllowedPortfolios()
    {
        $role = auth()->user()->role;
        $query = \App\Models\Portfolio::active()->select('id', 'name');

        if ($role === 'super_admin' || str_contains($role, 'state')) {
            $query->where('level', 'state');
        } elseif (str_contains($role, 'district')) {
            $query->where('level', 'district');
        } elseif (str_contains($role, 'tehsil')) {
            $query->where('level', 'tehsil');
        }

        return $query->get();
    }

    /**
     * Store a newly created blog post.
     */
    private function getRedirectRouteName()
    {
        $role = auth()->user()->role;
        if ($role === 'super_admin') return 'state.blog.index';
        if (str_contains($role, 'district')) return 'district.blog.index';
        if (str_contains($role, 'tehsil')) return 'tehsil.blog.index';
        return 'state.blog.index';
    }

    /**
     * Store a newly created blog post.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string|max:500',
            'category' => 'required|in:circular,statement,notice,article,event,announcement',
            'publish_date' => 'nullable|date',
            'status' => 'required|in:draft,published,archived',
            'visibility' => 'required|in:public,members_only',
            'featured_image' => 'nullable|image|max:2048',
            'event_type' => 'nullable|string|max:100',
            'event_scope' => 'nullable|string|in:tehsil,district,state',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'venue' => 'nullable|string|max:255',
            'organizer_portfolio_id' => 'nullable|exists:portfolios,id',
            'priority' => 'nullable|string|in:normal,high,urgent',
            'expiry_date' => 'nullable|date|after:today',
        ]);

        $validated['slug'] = BlogPost::generateSlug($validated['title']);
        $validated['author_id'] = auth()->id();

        if ($request->hasFile('featured_image')) {
            $validated['featured_image'] = $request->file('featured_image')->store('blog-images', 'public');
        }

        if ($validated['status'] === 'published' && empty($validated['publish_date'])) {
            $validated['publish_date'] = now();
        }

        BlogPost::create($validated);

        return redirect()->route($this->getRedirectRouteName())
            ->with('success', 'Blog post created successfully.');
    }

    /**
     * Display the specified blog post (admin view).
     */
    public function show(BlogPost $blog)
    {
        $blog->load(['author.member', 'organizer']);

        // Determine Office Profile based on the AUTHOR'S role/location
        // This ensures the document reflects the issuer, not the viewer.
        $author = $blog->author;
        $officeProfile = null;

        if ($author) {
            if ($author->role === 'super_admin' || str_contains($author->role, 'state')) {
                $state = \App\Models\State::first();
                $officeProfile = $state?->officeProfile;
            } elseif (str_contains($author->role, 'district') && $author->district_id) {
                $district = \App\Models\District::find($author->district_id);
                $officeProfile = $district?->officeProfile;
            } elseif (str_contains($author->role, 'tehsil') && $author->tehsil_id) {
                $tehsil = \App\Models\Tehsil::find($author->tehsil_id);
                $officeProfile = $tehsil?->officeProfile;
            }
        }

        return Inertia::render('Blog/Show', [
            'post' => $blog,
            'officeProfile' => $officeProfile,
        ]);
    }

    /**
     * Show the form for editing the specified blog post.
     */
    public function edit(BlogPost $blog)
    {
        $this->authorize('update', $blog);
        
        return Inertia::render('Blog/Edit', [
            'post' => $blog,
            'categories' => ['circular', 'statement', 'notice', 'article', 'event', 'announcement'],
            'portfolios' => $this->getAllowedPortfolios(),
        ]);
    }

    /**
     * Update the specified blog post.
     */
    public function update(Request $request, BlogPost $blog)
    {
        $this->authorize('update', $blog);
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string|max:500',
            'category' => 'required|in:circular,statement,notice,article,event,announcement',
            'publish_date' => 'nullable|date',
            'status' => 'required|in:draft,published,archived',
            'visibility' => 'required|in:public,members_only',
            'featured_image' => 'nullable|image|max:2048',
            'event_type' => 'nullable|string|max:100',
            'event_scope' => 'nullable|string|in:tehsil,district,state',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'venue' => 'nullable|string|max:255',
            'organizer_portfolio_id' => 'nullable|exists:portfolios,id',
            'priority' => 'nullable|string|in:normal,high,urgent',
            'expiry_date' => 'nullable|date|after:today',
        ]);

        // Update slug if title changed
        if ($blog->title !== $validated['title']) {
            $validated['slug'] = BlogPost::generateSlug($validated['title']);
        }

        if ($request->hasFile('featured_image')) {
            $validated['featured_image'] = $request->file('featured_image')->store('blog-images', 'public');
        }

        if ($validated['status'] === 'published' && empty($blog->publish_date) && empty($validated['publish_date'])) {
            $validated['publish_date'] = now();
        }

        $blog->update($validated);

        return redirect()->route($this->getRedirectRouteName())
            ->with('success', 'Blog post updated successfully.');
    }

    /**
     * Remove the specified blog post.
     */
    public function destroy(BlogPost $blog)
    {
        $this->authorize('delete', $blog);
        
        $blog->delete();

        return redirect()->route($this->getRedirectRouteName())
            ->with('success', 'Blog post deleted successfully.');
    }

    /**
     * Remove the featured image from a blog post.
     */
    public function removeFeaturedImage(BlogPost $blog)
    {
        $this->authorize('update', $blog);
        
        if ($blog->featured_image) {
            // Delete the image file from storage
            \Storage::disk('public')->delete($blog->featured_image);
            
            // Clear the database field
            $blog->update(['featured_image' => null]);
        }

        return back()->with('success', 'Featured image removed successfully.');
    }

    /**
     * Download the blog post as a PDF.
     */
    public function downloadPdf(BlogPost $post)
    {
        $post->load(['author', 'organizer']);
        $blog = $post; // Alias for backward compatibility with existing code blocks

        // Determine Office Profile based on the AUTHOR'S role/location
        // This ensures the document reflects the issuer, not the viewer.
        $author = $blog->author;
        $officeProfile = null;

        if ($author) {
            if ($author->role === 'super_admin' || str_contains($author->role, 'state')) {
                $state = \App\Models\State::first();
                $officeProfile = $state?->officeProfile;
            } elseif (str_contains($author->role, 'district') && $author->district_id) {
                $district = \App\Models\District::find($author->district_id);
                $officeProfile = $district?->officeProfile;
            } elseif (str_contains($author->role, 'tehsil') && $author->tehsil_id) {
                $tehsil = \App\Models\Tehsil::find($author->tehsil_id);
                $officeProfile = $tehsil?->officeProfile;
            }
        }

        if (!$officeProfile) {
            $state = \App\Models\State::first();
            $officeProfile = $state?->officeProfile;
        }

        // Prepare Base64 Images for reliable PDF rendering
        $logoBase64 = null;
        $watermarkBase64 = null;
        $headerLogoBase64 = null;

        if ($officeProfile) {
            // Process Primary Logo
            if ($officeProfile->primary_logo_path) {
                $path = storage_path('app/public/' . $officeProfile->primary_logo_path);
                if (file_exists($path)) {
                    $type = pathinfo($path, PATHINFO_EXTENSION);
                    $data = file_get_contents($path);
                    $logoBase64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
                }
            }

            // Process Header (Secondary) Logo
            if ($officeProfile->header_logo_path) {
                $path = storage_path('app/public/' . $officeProfile->header_logo_path);
                if (file_exists($path)) {
                    $type = pathinfo($path, PATHINFO_EXTENSION);
                    $data = file_get_contents($path);
                    $headerLogoBase64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
                }
            }

            // Process Watermark (fallback to primary logo if no specific watermark set)
            $watermarkPathStr = $officeProfile->watermark_logo_path ?? $officeProfile->primary_logo_path;
            if ($watermarkPathStr) {
                 $path = storage_path('app/public/' . $watermarkPathStr);
                 if (file_exists($path)) {
                    $type = pathinfo($path, PATHINFO_EXTENSION);
                    $data = file_get_contents($path);
                    $watermarkBase64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
                 }
            }
        }

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdfs.blog-post', [
            'post' => $blog,
            'officeProfile' => $officeProfile,
            'logoBase64' => $logoBase64,
            'headerLogoBase64' => $headerLogoBase64,
            'watermarkBase64' => $watermarkBase64,
        ]);

        // Support UTF-8 (optional but good)
        $pdf->setPaper('a4', 'portrait');

        return $pdf->download(\Illuminate\Support\Str::slug($post->title) . '.pdf');
    }

    /**
     * Public blog listing (for welcome page or public access).
     */
    public function publicIndex()
    {
        $posts = BlogPost::published()
            ->public()
            ->with('author')
            ->latest('publish_date')
            ->paginate(10);

        return Inertia::render('Blog/Public', [
            'posts' => $posts,
        ]);
    }

    /**
     * Public blog post view.
     */
    public function publicShow($slug)
    {
        $post = BlogPost::where('slug', $slug)
            ->published()
            ->with('author')
            ->firstOrFail();

        return Inertia::render('Blog/PublicShow', [
            'post' => $post,
        ]);
    }
}
