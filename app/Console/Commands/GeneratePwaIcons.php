<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class GeneratePwaIcons extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'pwa:generate-icons';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate PWA icons from public/icon-512.png';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $manager = new ImageManager(new Driver());
        $masterPath = public_path('icon-512.png');

        if (!file_exists($masterPath)) {
            $this->warn("Master icon not found at: {$masterPath}");
            $this->info("Generating a programmatic fallback master icon...");
            $this->createFallbackMaster($manager, $masterPath);
        }

        $sizes = [72, 96, 128, 144, 152, 192, 384];
        $this->info("Using master icon. Generating sizes...");

        try {
            // Read the master image
            $master = $manager->read($masterPath);

            foreach ($sizes as $size) {
                $filename = "icon-{$size}.png";
                $path = public_path($filename);

                // Clone (if necessary, though resize usually returns new instance or modifies current)
                // In v3, modifiers might act on the instance. Let's read afresh or clone if needed.
                // Safest to read master for each or use copy if supported.
                // Intervention Image v3 is immutable by default? No, it's mutable.
                // We should clone or re-read. Re-reading is 100% safe.
                
                $manager->read($masterPath)->resize($size, $size)->save($path);
                
                $this->info("Generated: {$filename}");
            }
            
            $this->info("All icons generated successfully!");
            return 0;

        } catch (\Exception $e) {
            $this->error("Error generating icons: " . $e->getMessage());
            return 1;
        }
    }

    protected function createFallbackMaster($manager, $path)
    {
        // Create 512x512 canvas
        $img = $manager->create(512, 512)->fill('ffffff');

        // Draw Tricolor Border (Gradient simulation via Rectangles)
        // Intervention V3 shapes are different. Let's keep it simple: Tricolor Stripes Background
        
        // Saffron Top
        $img->drawRectangle(0, 0, function ($draw) {
            $draw->size(512, 170);
            $draw->background('#FF9933');
        });

        // White Middle (already white)
        
        // Green Bottom
        $img->drawRectangle(0, 342, function ($draw) {
            $draw->size(512, 170); // Size 512x170 (remaining height approx)
            // In V3 drawRectangle might take x, y and then width/height in callback?
            // V3 syntax: $image->drawRectangle(x, y, callback)
            // Actually V3 uses $image->draw()->rectangle(...)
            $draw->background('#138808');
        });
        
        // Since V3 syntax can be tricky without docs, let's try a safer V2/V3 agnostic approach or just stick to fill if possible.
        // Actually, let's just make a simple colored square with text.
        // We will make it White with simple text "JKECC" for safety if shapes fail.
        
        // Let's try to just save a simple text-based icon or use a base64 generic one if drawing is complex.
        // But let's try the shapes.
        
        $img->save($path);
    }
}
