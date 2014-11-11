module Jekyll

  class NginxRedirects < Generator
    priority :low

    def generate(site)
      site.static_files << NginxRedirectsFile.new(site, site.source, '/', 'redirects.nginx')
    end
  end

  # generate nginx redirects file
  class NginxRedirectsFile < StaticFile

    def initialize(site, base, dir, name)
      @site = site
      @base = base
      @dir  = dir
      @name = name
    end

    def write(dest)
      File.open(dest+'/redirects.nginx', 'w') { |file| file.write(redirect_rules) } if redirect_rules.length > 0
    end

    def redirect_rules
      @redirect_rules ||= redirect_pages.map do |page|
        page.data['redirects'].map do |redirect_origin|
          redirect_rule(redirect_origin, page.url)
        end
      end.flatten.uniq.join("\n")
    end

    def redirect_pages
      @redirected_pages ||= (@site.pages + @site.posts).select{|post| post.data.key? 'redirects' }
    end

    def redirect_rule(origin,destination)
      "location #{origin} { return 301 #{destination}; }"
    end

  end
end