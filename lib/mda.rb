class Mda

  def initialize(rows, columns)
    @max_row = rows
    @max_column = columns
    @a = Array.new(rows)
    @a.map! { Array.new(columns) }
    @first_node = true
  end

  # =begin
  #    def fill_array(row,column,value)
  #      @a[row-1][column-1]=value
  #    end

  #    def create_file

  #      file = File.new("archivo_salida.txt","w+")
  #      begin
  #        for i in 0 ... @max_row
  #          for j in 0 ... @max_column
  #            file.printf @a[i][j].to_s
  #            if j == @max_column-1
  #              file.printf "\n"
  #            else file.printf ","
  #            end
  #          end
  #        end

  #      rescue StandardError => e
  #        puts e
  #      ensure
  #        file.close if file.nil?
  #      end

  #    end
  #    =end

  def fill_array(i, row, column, value, stretch_type, lat, lon)
    @a[i][0] = row
    @a[i][1] = column
    @a[i][2] = value
    @a[i][3] = stretch_type
    @a[i][4] = lat
    @a[i][5] = lon
  end

  # Metodo create_file
  # crea un formato para leer desde disco sin tener que ir a la base de datos
  # el formato que crea es
  # nodo:nodoSiguiente,distancia,tipo;nodoSiguiente,distancia,tipo;...;&latitud,longitud\n

  def create_file
    file = File.new("#{RAILS_ROOT}/lib/dijkstra/listas.txt", "w+")
    begin
      for i in 0 ... @max_row - 1

        # if @first_node
        #   file.printf @a[i][0].to_s + ":"
        # end
        # if @a[i+1][0] == @a[i][0]
        #   file.printf @a[i][1].to_s + "," + @a[i][2].to_s + ";"
        #   @first_node = false
        # elsif @a[i+1][0] != @a[i][0]
        #   file.printf @a[i][1].to_s + "," + @a[i][2].to_s + ";" + "\n"
        #   @first_node = true
        # end

        if @first_node
          file.printf @a[i][0].to_s + ":"
        end
        if @a[i+1][0] == @a[i][0]
          file.printf @a[i][1].to_s + "," + @a[i][2].to_s + "," + @a[i][3].to_s + ";"
          @first_node = false
        elsif @a[i+1][0] != @a[i][0]
          file.printf @a[i][1].to_s + "," + @a[i][2].to_s + "," + @a[i][3].to_s + "&" + @a[i][4].to_s + "," + @a[i][5].to_s + "\n"
          @first_node = true
        end
      end
      file.printf("\n")
    rescue StandardError => e
      puts e
    ensure
      file.close if file.nil?
    end

  end

  def test_file
    iniTime = Time.now
    puts "#The initial Time: #{iniTime} "
    m = Mda.new(10000, 10000)
    puts  "#{Time.now - iniTime} seconds for creating the matrix"
    m.fill_array(1, 1, "wahahhahah", 1)
    m.fill_array(1, 10, "pos 1 10", 2)
    puts  "#{Time.now - iniTime} seconds for FILLING the matrix}"
    m.create_file
    puts  "#{Time.now - iniTime} seconds for creating the file}"
  end

end
