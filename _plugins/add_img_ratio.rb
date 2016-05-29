Jekyll::Hooks.register :posts, :post_render do |post|
    if post.data["image-ratios"]
        post_domtree = Nokogiri::HTML(post.output)
        image_tags = post_domtree.xpath('//img')

        if !image_tags.empty?
            if !File.exists?('_data/photo_sizes.yml')
                hash = {}
            else
                hash = YAML.load_file('_data/photo_sizes.yml')

                if hash
                    file_opened = true
                else
                    hash = {}
                end
            end

            image_tags.each_with_index do |img, i|
                if img.attr('src') && img.attr('data-src').nil? && !img.attr('src').end_with?(".svg")
                    src_digest = Digest::MD5.hexdigest(img.attr('src'))

                    unless hash[src_digest]
                        begin
                            hash[src_digest] = {}
                            hash[src_digest]['size'] = FastImage.size(img.attr('src'))
                            hash[src_digest]['data-ratio'] = hash[src_digest]['size'][0].to_f / hash[src_digest]['size'][1].to_f
                        rescue Exception => e
                            puts "Couldn't fetch size for image " << img.attr('src') << ", due to error: " << e
                        end
                    end

                    img['data-ratio'] = hash[src_digest]['data-ratio']
                    img['data-src'] = img.attr('src')
                    img['data-width'] = hash[src_digest]['size'][0]
                    img['data-height'] = hash[src_digest]['size'][1]
                    img['data-index'] = i
                    img['src'] = ''
                end
            end

            post.output = post_domtree.to_html

            File.truncate('_data/photo_sizes.yml', 0) if file_opened
            File.write('_data/photo_sizes.yml', hash.to_yaml)
        end
    end
end
