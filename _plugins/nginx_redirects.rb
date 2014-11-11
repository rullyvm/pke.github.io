module Jekyll


  # Place holder - reference: https://gist.github.com/920651
  class NginxRedirectsFile < StaticFile
    def write(dest)
      # do nothing
    end
  end

  # generate nginx redirects file
  class NginxRedirects < Generator


    # safe true
    priority :low

    # find all posts with a redirect property and create a new page for each entry
    def generate(site)
      pages_with_redirects = (site.pages + site.posts).select{|post| post.data.key? 'redirects' }
      output = pages_with_redirects.map do |page|
        page.data['redirects'].map do |redirect_origin|
          nginx_redirect(redirect_origin, page.url)
        end
      end.flatten.uniq.join("\n")

      if output.length > 0
        File.open('_site/redirects.nginx', 'w') { |file| file.write(output) }
        File.open('redirects.nginx', 'w') { |file| file.write(output) } #for jekyll-hooks
        # Add this output file so it won't be "cleaned away"
        site.static_files << NginxRedirectsFile.new(site, site.source, '', 'redirects.nginx')
      end
    end

    def nginx_redirect(origin,destination)
      "location #{origin} { return 301 #{destination}; }"
    end

  end

end