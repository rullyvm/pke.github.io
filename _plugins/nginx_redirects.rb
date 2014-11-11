module Jekyll

  # generate nginx redirects file
  class NginxRedirectsFile < StaticFile

    def initialize(site, base, dir, name)
      @site = site
      @base = base
      @dir  = dir
      @name = name
    end

    def write(dest)
      if file_contents.length > 0
        File.open(dest+'/redirects.nginx', 'w') { |file| file.write(file_contents) } #for jekyll-hooks
        @site.static_files << NginxRedirectsFile.new(@site, @site.source, '/', 'redirects.nginx')
      end
    end

    def nginx_redirect(origin,destination)
      "location #{origin} { return 301 #{destination}; }"
    end

    def redirect_pages
      @redirected_pages ||= (@site.pages + @site.posts).select{|post| post.data.key? 'redirects' }
    end

    def file_contents
      @file_contents ||= pages_with_redirects.map do |page|
        page.data['redirects'].map do |redirect_origin|
          nginx_redirect(redirect_origin, page.url)
        end
      end.flatten.uniq.join("\n")
    end

  end
end