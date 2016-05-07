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

            image_tags.each do |img|
                unless img.attr('src').end_with? ".svg"
                    src_digest = Digest::MD5.hexdigest(img.attr('src'))

                    unless hash[src_digest]
                        begin
                            hash[src_digest] = {}
                            hash[src_digest]['size'] = FastImage.size(img.attr('src'))
                            hash[src_digest]['ratio'] = hash[src_digest]['size'][0].to_f / hash[src_digest]['size'][1].to_f
                        rescue Exception => e
                            puts "Couldn't fetch size for image " << img.attr('src') << ", due to error: " << e
                        end
                    end

                    img['ratio'] = hash[src_digest]['ratio']
                end
            end

            post.output = post_domtree.to_html

            File.truncate('_data/photo_sizes.yml', 0) if file_opened
            File.write('_data/photo_sizes.yml', hash.to_yaml)
        end
    end
end
